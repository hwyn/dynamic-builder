import { isFunction, isPlainObject, isString } from 'lodash';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { generateUUID } from './uuid';
export function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object (.*)\]/, '$1');
}
export function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}
export function isObservable(obj) {
    return obj && !!obj.subscribe;
}
export function transformObservable(obj) {
    return isObservable(obj) ? obj : isPromise(obj) ? from(obj) : of(obj);
}
export function transformObj(result, returnValue) {
    var notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe(map(function () { return returnValue; }));
}
export function createDetectChanges(subject) {
    var isRun = false;
    return function (value) {
        if (isRun)
            return;
        isRun = true;
        subject.next(value);
        isRun = false;
    };
}
export function funcToObservable(func) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return transformObservable(func.apply(void 0, args));
    };
}
export var serializeAction = function (action) {
    var sAction = (isString(action) ? { name: action } : isFunction(action) ? { handler: action } : action);
    sAction && !sAction._uid && (sAction._uid = generateUUID(5));
    return sAction;
};
export function withValue(value) {
    return { value: value, enumerable: true, configurable: true };
}
export function withGetOrSet(get, set) {
    return { get: get, set: set, enumerable: true, configurable: true };
}
export function cloneDeepPlain(value) {
    var obj = value;
    var _type = type(obj);
    if (_type === 'Array')
        return obj.map(cloneDeepPlain);
    if (_type === 'Object' && isPlainObject(obj)) {
        return Object.keys(obj).reduce(function (o, key) {
            var _a;
            return Object.assign(o, (_a = {}, _a[key] = cloneDeepPlain(obj[key]), _a));
        }, {});
    }
    return obj;
}

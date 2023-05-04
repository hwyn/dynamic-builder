import { __spreadArray } from "tslib";
import { cloneDeepWith, isPlainObject } from 'lodash';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { observableMap } from './operators/exec-observable';
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
export function funcToObservable(func) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Observable(function (observer) {
            var handler = function (result) {
                observer.next(result);
                observer.complete();
            };
            func.apply(void 0, __spreadArray([handler], args, false));
        }).pipe(observableMap(transformObservable));
    };
}
export function withValue(value) {
    return { value: value, enumerable: true, configurable: true };
}
export function withGetOrSet(get, set) {
    return { get: get, set: set, enumerable: true, configurable: true };
}
export function cloneDeepPlain(value) {
    return cloneDeepWith(value, function (obj) {
        if (type(obj) === 'Object' && !isPlainObject(obj)) {
            return obj;
        }
    });
}

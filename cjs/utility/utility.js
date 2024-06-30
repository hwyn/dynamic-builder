"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeAction = void 0;
exports.type = type;
exports.isPromise = isPromise;
exports.isObservable = isObservable;
exports.transformObservable = transformObservable;
exports.transformObj = transformObj;
exports.createDetectChanges = createDetectChanges;
exports.funcToObservable = funcToObservable;
exports.withValue = withValue;
exports.withGetOrSet = withGetOrSet;
exports.cloneDeepPlain = cloneDeepPlain;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var exec_observable_1 = require("./operators/exec-observable");
var uuid_1 = require("./uuid");
function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object (.*)\]/, '$1');
}
function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}
function isObservable(obj) {
    return obj && !!obj.subscribe;
}
function transformObservable(obj) {
    return isObservable(obj) ? obj : isPromise(obj) ? (0, rxjs_1.from)(obj) : (0, rxjs_1.of)(obj);
}
function transformObj(result, returnValue) {
    var notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe((0, operators_1.map)(function () { return returnValue; }));
}
function createDetectChanges(subject) {
    var isRun = false;
    return function (value) {
        if (isRun)
            return;
        isRun = true;
        subject.next(value);
        isRun = false;
    };
}
function funcToObservable(func) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new rxjs_1.Observable(function (observer) {
            var handler = function (result) {
                observer.next(result);
                observer.complete();
            };
            func.apply(void 0, tslib_1.__spreadArray([handler], args, false));
        }).pipe((0, exec_observable_1.observableMap)(transformObservable));
    };
}
var serializeAction = function (action) {
    var sAction = ((0, lodash_1.isString)(action) ? { name: action } : (0, lodash_1.isFunction)(action) ? { handler: action } : action);
    sAction && !sAction._uid && (sAction._uid = (0, uuid_1.generateUUID)(5));
    return sAction;
};
exports.serializeAction = serializeAction;
function withValue(value) {
    return { value: value, enumerable: true, configurable: true };
}
function withGetOrSet(get, set) {
    return { get: get, set: set, enumerable: true, configurable: true };
}
function cloneDeepPlain(value) {
    var obj = value;
    var _type = type(obj);
    if (_type === 'Array')
        return obj.map(cloneDeepPlain);
    if (_type === 'Object' && (0, lodash_1.isPlainObject)(obj)) {
        return Object.keys(obj).reduce(function (o, key) {
            var _a;
            return Object.assign(o, (_a = {}, _a[key] = cloneDeepPlain(obj[key]), _a));
        }, {});
    }
    return obj;
}

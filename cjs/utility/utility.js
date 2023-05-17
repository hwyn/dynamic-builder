"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDeepPlain = exports.withGetOrSet = exports.withValue = exports.funcToObservable = exports.transformObj = exports.transformObservable = exports.isObservable = exports.isPromise = exports.type = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var exec_observable_1 = require("./operators/exec-observable");
function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object (.*)\]/, '$1');
}
exports.type = type;
function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}
exports.isPromise = isPromise;
function isObservable(obj) {
    return obj && !!obj.subscribe;
}
exports.isObservable = isObservable;
function transformObservable(obj) {
    return isObservable(obj) ? obj : isPromise(obj) ? (0, rxjs_1.from)(obj) : (0, rxjs_1.of)(obj);
}
exports.transformObservable = transformObservable;
function transformObj(result, returnValue) {
    var notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe((0, operators_1.map)(function () { return returnValue; }));
}
exports.transformObj = transformObj;
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
exports.funcToObservable = funcToObservable;
function withValue(value) {
    return { value: value, enumerable: true, configurable: true };
}
exports.withValue = withValue;
function withGetOrSet(get, set) {
    return { get: get, set: set, enumerable: true, configurable: true };
}
exports.withGetOrSet = withGetOrSet;
function cloneDeepPlain(value) {
    return (0, lodash_1.cloneDeepWith)(value, function (obj) {
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
    });
}
exports.cloneDeepPlain = cloneDeepPlain;

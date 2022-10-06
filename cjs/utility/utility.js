"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withGetOrSet = exports.withValue = exports.transformObj = exports.transformObservable = exports.isObservable = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function isObservable(obj) {
    return obj && !!obj.subscribe;
}
exports.isObservable = isObservable;
function transformObservable(obj) {
    return isObservable(obj) ? obj : (0, rxjs_1.of)(obj);
}
exports.transformObservable = transformObservable;
function transformObj(result, returnValue) {
    var notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe((0, operators_1.map)(function () { return returnValue; }));
}
exports.transformObj = transformObj;
function withValue(value) {
    return { value: value, enumerable: true, configurable: true };
}
exports.withValue = withValue;
function withGetOrSet(get, set) {
    return { get: get, set: set, enumerable: true, configurable: true };
}
exports.withGetOrSet = withGetOrSet;

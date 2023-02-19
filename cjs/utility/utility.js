"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDeepPlain = exports.withGetOrSet = exports.withValue = exports.transformObj = exports.transformObservable = exports.isObservable = exports.type = void 0;
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object (.*)\]/, '$1');
}
exports.type = type;
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
function cloneDeepPlain(value) {
    return (0, lodash_1.cloneDeepWith)(value, function (obj) {
        if (type(obj) === 'Object' && !(0, lodash_1.isPlainObject)(obj)) {
            return obj;
        }
    });
}
exports.cloneDeepPlain = cloneDeepPlain;

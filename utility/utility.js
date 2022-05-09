"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withGetOrSet = exports.withValue = exports.transformObj = exports.transformObservable = exports.isObservable = void 0;
const import_rxjs_1 = require("@fm/import-rxjs");
const import_rxjs_2 = require("@fm/import-rxjs");
function isObservable(obj) {
    return obj && !!obj.subscribe;
}
exports.isObservable = isObservable;
function transformObservable(obj) {
    return obj && obj.subscribe ? obj : (0, import_rxjs_1.of)(obj);
}
exports.transformObservable = transformObservable;
function transformObj(result, returnValue) {
    const notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe((0, import_rxjs_2.map)(() => returnValue));
}
exports.transformObj = transformObj;
function withValue(value) {
    return { value, enumerable: true, configurable: true };
}
exports.withValue = withValue;
function withGetOrSet(get, set) {
    return { get, set, enumerable: true, configurable: true };
}
exports.withGetOrSet = withGetOrSet;

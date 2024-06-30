"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observableMap = observableMap;
exports.observableTap = observableTap;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function operate(destination, observerOrNext) {
    destination.complete;
    return {
        next: (observerOrNext === null || observerOrNext === void 0 ? void 0 : observerOrNext.next) || (function (result) { return destination.next(result); }),
        error: (observerOrNext === null || observerOrNext === void 0 ? void 0 : observerOrNext.error) || (function (error) { return destination.error(error); })
    };
}
function observableMap(fn) {
    return function (source) { return new rxjs_1.Observable(function (destination) {
        source.subscribe(operate(destination, { next: function (result) { return fn(result).subscribe(destination); } }));
    }); };
}
function observableTap(fn) {
    return function (source) { return new rxjs_1.Observable(function (destination) {
        source.subscribe(operate(destination, { next: function (result) { return fn(result).pipe((0, operators_1.map)(function () { return result; })).subscribe(destination); } }));
    }); };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observableTap = exports.observableMap = void 0;
var operators_1 = require("rxjs/operators");
function observableMap(fn) {
    return function (source) { return source.lift(function (liftedSource) {
        var _this = this;
        liftedSource.subscribe(function (result) { return fn(result).subscribe(_this); });
    }); };
}
exports.observableMap = observableMap;
function observableTap(fn) {
    return function (source) { return source.lift(function (liftedSource) {
        var _this = this;
        liftedSource.subscribe(function (result) { return fn(result).pipe((0, operators_1.map)(function () { return result; })).subscribe(_this); });
    }); };
}
exports.observableTap = observableTap;

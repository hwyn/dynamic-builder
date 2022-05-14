"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observableTap = exports.observableMap = void 0;
const import_rxjs_1 = require("@fm/import-rxjs");
function observableMap(fn) {
    return (souce) => souce.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).subscribe(this));
    });
}
exports.observableMap = observableMap;
function observableTap(fn) {
    return (souce) => souce.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).pipe((0, import_rxjs_1.map)(() => result)).subscribe(this));
    });
}
exports.observableTap = observableTap;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observableTap = exports.observableMap = void 0;
const operators_1 = require("rxjs/operators");
function observableMap(fn) {
    return (souce) => souce.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).subscribe(this));
    });
}
exports.observableMap = observableMap;
function observableTap(fn) {
    return (souce) => souce.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).pipe((0, operators_1.map)(() => result)).subscribe(this));
    });
}
exports.observableTap = observableTap;

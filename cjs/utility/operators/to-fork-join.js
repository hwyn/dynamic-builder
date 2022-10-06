"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toForkJoin = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utility_1 = require("../utility");
function toForkJoin(resultList) {
    var obsListIndex = [];
    var obsList = resultList.filter(function (result, index) {
        var isObs = (0, utility_1.isObservable)(result);
        isObs && obsListIndex.push(index);
        return isObs;
    });
    return !obsList.length ? (0, rxjs_1.of)(resultList) : (0, rxjs_1.forkJoin)(obsList).pipe((0, operators_1.map)(function (results) {
        obsListIndex.forEach(function (key, index) { return resultList[key] = results[index]; });
        return resultList;
    }));
}
exports.toForkJoin = toForkJoin;

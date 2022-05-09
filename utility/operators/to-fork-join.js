"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toForkJoin = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utility_1 = require("../utility");
function toForkJoin(resultList) {
    const obsListIndex = [];
    const obsList = resultList.filter((result, index) => {
        const isObs = (0, utility_1.isObservable)(result);
        isObs && obsListIndex.push(index);
        return isObs;
    });
    return !obsList.length ? (0, rxjs_1.of)(resultList) : (0, rxjs_1.forkJoin)(obsList).pipe((0, operators_1.map)((results) => {
        obsListIndex.forEach((key, index) => resultList[key] = results[index]);
        return resultList;
    }));
}
exports.toForkJoin = toForkJoin;

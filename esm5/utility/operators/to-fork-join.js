import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isObservable } from '../utility';
export function toForkJoin(resultList) {
    var obsListIndex = [];
    var obsList = resultList.filter(function (result, index) {
        var isObs = isObservable(result);
        isObs && obsListIndex.push(index);
        return isObs;
    });
    return !obsList.length ? of(resultList) : forkJoin(obsList).pipe(map(function (results) {
        obsListIndex.forEach(function (key, index) { return resultList[key] = results[index]; });
        return resultList;
    }));
}

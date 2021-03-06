import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isObservable } from '../utility';
export function toForkJoin(resultList) {
    const obsListIndex = [];
    const obsList = resultList.filter((result, index) => {
        const isObs = isObservable(result);
        isObs && obsListIndex.push(index);
        return isObs;
    });
    return !obsList.length ? of(resultList) : forkJoin(obsList).pipe(map((results) => {
        obsListIndex.forEach((key, index) => resultList[key] = results[index]);
        return resultList;
    }));
}

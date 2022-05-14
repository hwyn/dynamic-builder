import { map } from 'rxjs/operators';
export function observableMap(fn) {
    return (souce) => souce.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).subscribe(this));
    });
}
export function observableTap(fn) {
    return (souce) => souce.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).pipe(map(() => result)).subscribe(this));
    });
}

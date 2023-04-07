import { map } from 'rxjs/operators';
export function observableMap(fn) {
    return (source) => source.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).subscribe(this));
    });
}
export function observableTap(fn) {
    return (source) => source.lift(function (liftedSource) {
        liftedSource.subscribe((result) => fn(result).pipe(map(() => result)).subscribe(this));
    });
}

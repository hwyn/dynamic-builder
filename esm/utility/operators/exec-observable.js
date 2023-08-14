import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
function operate(destination, observerOrNext) {
    destination.complete;
    return {
        next: (observerOrNext === null || observerOrNext === void 0 ? void 0 : observerOrNext.next) || ((result) => destination.next(result)),
        error: (observerOrNext === null || observerOrNext === void 0 ? void 0 : observerOrNext.error) || ((error) => destination.error(error))
    };
}
export function observableMap(fn) {
    return (source) => new Observable((destination) => {
        source.subscribe(operate(destination, { next: (result) => fn(result).subscribe(destination) }));
    });
}
export function observableTap(fn) {
    return (source) => new Observable((destination) => {
        source.subscribe(operate(destination, { next: (result) => fn(result).pipe(map(() => result)).subscribe(destination) }));
    });
}

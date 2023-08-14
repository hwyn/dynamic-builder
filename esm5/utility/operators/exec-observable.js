import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
function operate(destination, observerOrNext) {
    destination.complete;
    return {
        next: (observerOrNext === null || observerOrNext === void 0 ? void 0 : observerOrNext.next) || (function (result) { return destination.next(result); }),
        error: (observerOrNext === null || observerOrNext === void 0 ? void 0 : observerOrNext.error) || (function (error) { return destination.error(error); })
    };
}
export function observableMap(fn) {
    return function (source) { return new Observable(function (destination) {
        source.subscribe(operate(destination, { next: function (result) { return fn(result).subscribe(destination); } }));
    }); };
}
export function observableTap(fn) {
    return function (source) { return new Observable(function (destination) {
        source.subscribe(operate(destination, { next: function (result) { return fn(result).pipe(map(function () { return result; })).subscribe(destination); } }));
    }); };
}

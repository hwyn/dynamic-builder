import { of } from 'rxjs';
import { map } from 'rxjs/operators';
export function isObservable(obj) {
    return obj && !!obj.subscribe;
}
export function transformObservable(obj) {
    return isObservable(obj) ? obj : of(obj);
}
export function transformObj(result, returnValue) {
    var notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe(map(function () { return returnValue; }));
}
export function withValue(value) {
    return { value: value, enumerable: true, configurable: true };
}
export function withGetOrSet(get, set) {
    return { get: get, set: set, enumerable: true, configurable: true };
}

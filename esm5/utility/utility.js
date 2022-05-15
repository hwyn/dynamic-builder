import { of } from 'rxjs';
import { map } from 'rxjs/operators';
export function isObservable(obj) {
    return obj && !!obj.subscribe;
}
export function transformObservable(obj) {
    return obj && obj.subscribe ? obj : of(obj);
}
export function transformObj(result, returnValue) {
    const notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe(map(() => returnValue));
}
export function withValue(value) {
    return { value, enumerable: true, configurable: true };
}
export function withGetOrSet(get, set) {
    return { get, set, enumerable: true, configurable: true };
}

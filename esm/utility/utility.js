import { isPlainObject } from 'lodash';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { observableMap } from './operators/exec-observable';
export function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object (.*)\]/, '$1');
}
export function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}
export function isObservable(obj) {
    return obj && !!obj.subscribe;
}
export function transformObservable(obj) {
    return isObservable(obj) ? obj : isPromise(obj) ? from(obj) : of(obj);
}
export function transformObj(result, returnValue) {
    const notTransform = !isObservable(result) || typeof returnValue === 'undefined';
    return notTransform ? returnValue : result.pipe(map(() => returnValue));
}
export function createDetectChanges(subject) {
    let isRun = false;
    return (value) => {
        if (isRun)
            return;
        isRun = true;
        subject.next(value);
        isRun = false;
    };
}
export function funcToObservable(func) {
    return (...args) => new Observable(observer => {
        const handler = (result) => {
            observer.next(result);
            observer.complete();
        };
        func(handler, ...args);
    }).pipe(observableMap(transformObservable));
}
export function withValue(value) {
    return { value, enumerable: true, configurable: true };
}
export function withGetOrSet(get, set) {
    return { get, set, enumerable: true, configurable: true };
}
export function cloneDeepPlain(value) {
    const obj = value;
    const _type = type(obj);
    if (_type === 'Array')
        return obj.map(cloneDeepPlain);
    if (_type === 'Object' && isPlainObject(obj)) {
        return Object.keys(obj).reduce((o, key) => Object.assign(o, { [key]: cloneDeepPlain(obj[key]) }), {});
    }
    return obj;
}

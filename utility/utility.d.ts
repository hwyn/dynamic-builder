import { Observable, Subject } from 'rxjs';
export declare function type(obj: any): any;
export declare function isPromise(obj: any): boolean;
export declare function isObservable(obj: any): boolean;
export declare function transformObservable(obj: any): Observable<any>;
export declare function transformObj(result: any, returnValue?: any): any;
export declare function createDetectChanges<T = any>(subject: Subject<T>): (value: T) => void;
export declare function funcToObservable(func: (...args: any) => any): (...args: any[]) => Observable<unknown>;
export declare function withValue(value: any): PropertyDescriptor;
export declare function withGetOrSet(get: () => any, set?: (value: any) => void): {
    get: () => any;
    set: (value: any) => void;
    enumerable: boolean;
    configurable: boolean;
};
export declare function cloneDeepPlain<T>(value: T): T;

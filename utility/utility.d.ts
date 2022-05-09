import { Observable } from '@fm/import-rxjs';
export declare function isObservable(obj: any): boolean;
export declare function transformObservable(obj: any): Observable<any>;
export declare function transformObj(result: any, returnValue?: any): any;
export declare function withValue(value: any): PropertyDescriptor;
export declare function withGetOrSet(get: () => any, set?: (value: any) => void): {
    get: () => any;
    set: (value: any) => void;
    enumerable: boolean;
    configurable: boolean;
};

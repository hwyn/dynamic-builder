import { Observable } from 'rxjs';
export declare function observableMap(fn: (result: any) => Observable<any>): (source: Observable<any>) => Observable<any>;
export declare function observableTap(fn: (result: any) => Observable<any>): any;

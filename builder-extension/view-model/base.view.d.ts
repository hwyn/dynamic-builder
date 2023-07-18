import { Injector } from '@fm/di';
export declare class BaseView<T = any> {
    private injector;
    private _store;
    constructor(injector: Injector, _store: any);
    getBindValue(path: string, initialValue: any): any;
    setBindValue(path: string, value: any): void;
    deleteBindValue(path: string): void;
    refreshData(model: T): void;
    get model(): T;
}

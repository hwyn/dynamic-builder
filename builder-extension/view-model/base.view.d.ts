import { Injector } from '@fm/di';
export declare class BaseView<T = any> {
    private injector;
    private store;
    constructor(injector: Injector, store: any);
    setBindValue(binding: any, value: any): void;
    getBindValue(binding: any): any;
    refreshData(model: T): void;
    get model(): T;
}

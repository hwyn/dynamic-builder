import { LocatorStorage } from '@fm/di';
export declare class BaseView<T = any> {
    private ls;
    private store;
    constructor(ls: LocatorStorage, store: any);
    setBindValue(binding: any, value: any): void;
    getBindValue(binding: any): any;
    refreshData(model: T): void;
    get model(): T;
}

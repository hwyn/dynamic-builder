import { LocatorStorage } from '@fm/di';
export declare class BaseView<T = any> {
    private ls;
    private store;
    constructor(ls: LocatorStorage, store: any);
    setBindValue(dataBinding: any, value: any): void;
    getBindValue(dataBinding: any): any;
    refreshData(model: T): void;
    get model(): T;
}

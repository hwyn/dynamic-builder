import { Injector } from '@fm/di';
export declare class BaseView<T = any> {
    private injector;
    private _store;
    constructor(injector: Injector, _store: any);
    getBindValue({ path, default: value }: any): any;
    setBindValue(binding: any, value: any): void;
    deleteBindValue(binding: any): void;
    refreshData(model: T): void;
    get model(): T;
}

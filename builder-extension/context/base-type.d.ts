import { Injector } from '@fm/di';
export declare abstract class BaseType {
    protected injector: Injector;
    protected abstract invoke<T extends BaseType>(...args: any[]): T;
}

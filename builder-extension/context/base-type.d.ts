import { Injector } from '@fm/di';
export declare abstract class BaseType {
    protected injector: Injector;
    protected invoke<T extends BaseType>(context?: any): T;
}

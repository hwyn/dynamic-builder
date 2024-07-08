import { Injector } from '@hwy-fm/di';
export declare abstract class BaseType {
    protected injector: Injector;
    protected invoke<T extends BaseType>(context?: any): T;
}

import { Injector } from '@fm/di';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
import { BaseCovertImpl } from './type-api';
export declare abstract class BaseCovert implements BaseCovertImpl {
    protected injector: Injector;
    static covertName?: string;
    protected builder: BuilderModelExtensions;
    protected builderField: BuilderFieldExtensions;
    constructor(injector: Injector);
    protected invoke(context: any): any;
    abstract toModel(value: any): any;
    abstract toView(value: any): any;
}

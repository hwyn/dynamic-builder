import { Injector } from '@fm/di';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
import { BaseCovertImpl } from './type-api';
export declare abstract class BaseCovert implements BaseCovertImpl {
    protected injector: Injector;
    protected builder: BuilderModelExtensions;
    protected builderField: BuilderFieldExtensions;
    constructor(injector: Injector);
    abstract covertToModel(value: any): any;
    abstract covertToView(value: any): any;
}

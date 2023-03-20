import { Injector } from '@fm/di';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
import { BaseConvertImpl } from './type-api';
export declare abstract class BaseConvert implements BaseConvertImpl {
    protected injector: Injector;
    static convertName?: string;
    protected builder: BuilderModelExtensions;
    protected builderField: BuilderFieldExtensions;
    constructor(injector: Injector);
    protected invoke(context: any): any;
    abstract toModel(value: any): any;
    abstract toView(value: any): any;
}

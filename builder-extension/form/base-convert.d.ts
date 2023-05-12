import { BaseType } from '../context/base-type';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
import { BaseConvertImpl } from './type-api';
export declare abstract class BaseConvert extends BaseType implements BaseConvertImpl {
    static convertName?: string;
    protected builder: BuilderModelExtensions;
    protected builderField: BuilderFieldExtensions;
    abstract toModel(value: any): any;
    abstract toView(value: any): any;
}

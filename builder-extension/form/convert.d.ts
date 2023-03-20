import { Injector } from '@fm/di';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
import { BaseConvertImpl } from './type-api';
export declare class Convert {
    private injector;
    private getType;
    constructor(injector: Injector, getType: any);
    toModel(convertObj: BaseConvertImpl | undefined, value: any): any;
    toView(convertObj: BaseConvertImpl | undefined, value: any): any;
    getConvertObj(covertConfig: any, builder: BuilderModelExtensions, builderField: BuilderFieldExtensions): BaseConvertImpl;
}
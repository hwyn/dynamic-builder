import { Injector } from '@fm/di';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
import { BaseCovertImpl } from './type-api';
export declare class Covert {
    private injector;
    private getType;
    constructor(injector: Injector, getType: any);
    toModel(covertType: BaseCovertImpl | undefined, value: any): any;
    toView(covertType: BaseCovertImpl | undefined, value: any): any;
    getCovertObj(covertObj: any, builder: BuilderModelExtensions, builderField: BuilderFieldExtensions): BaseCovertImpl;
}

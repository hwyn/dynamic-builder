import { Injector } from '@fm/di';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
import { BaseCovertImpl } from './type-api';
export declare class Covert {
    private injector;
    private coverts;
    constructor(injector: Injector, coverts: any[][]);
    covertToModel(covertType: BaseCovertImpl | undefined, value: any): any;
    covertToView(covertType: BaseCovertImpl | undefined, value: any): any;
    getCovertObj(covertObj: any, builder: BuilderModelExtensions, builderField: BuilderFieldExtensions): BaseCovertImpl;
}

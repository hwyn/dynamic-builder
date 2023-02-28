import { BuilderModelExtensions, GridType } from '../type-api';
export declare class Grid {
    private config;
    constructor(json: any);
    private serializationConfig;
    getViewGrip(builder: BuilderModelExtensions, props: any): GridType;
}

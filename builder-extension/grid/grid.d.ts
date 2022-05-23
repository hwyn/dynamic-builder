import { BuilderModelExtensions, GridType } from '../type-api';
export declare class Grid {
    private builder;
    private config;
    constructor(builder: BuilderModelExtensions, json: any);
    private serializationConfig;
    getViewGrip(props: any): GridType;
}

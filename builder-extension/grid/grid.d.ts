import { BuilderModelExtensions, GridType } from '../type-api';
export declare class Grid {
    private builder;
    private config;
    constructor(json: any, builder: BuilderModelExtensions);
    private serializationConfig;
    getViewGrid(props: any): GridType;
    protected destroy(): void;
}

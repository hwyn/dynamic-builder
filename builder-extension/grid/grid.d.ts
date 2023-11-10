import type { BuilderJsonField } from '../../builder/type-api';
import type { BuilderModelExtensions, GridType } from '../type-api';
export declare class Grid {
    protected builder: BuilderModelExtensions;
    protected config: GridType;
    static create(json: BuilderJsonField, builder: BuilderModelExtensions): Grid;
    constructor(json: BuilderJsonField, builder: BuilderModelExtensions);
    protected serializationConfig(gridConfig: any): any;
    getViewGrid(props: any): GridType;
    protected destroy(): void;
}

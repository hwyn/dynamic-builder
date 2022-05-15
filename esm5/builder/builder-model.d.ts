import { LocatorStorage } from '@fm/di';
import { Visibility } from './consts';
import { BuilderField, BuilderModelImplements, CacheObj } from './type-api';
export declare class BuilderModel<S extends BuilderModelImplements = BuilderModelImplements, M extends BuilderField = BuilderField> implements BuilderModelImplements {
    ls: LocatorStorage;
    id: string | undefined;
    parent: S | null;
    children: S[];
    $$cache: CacheObj;
    Element: any;
    constructor(ls: LocatorStorage);
    getFieldByTypes<T = M>(type: string): T[];
    getAllFieldByTypes<T = M>(type: string): T[];
    getFieldById<T = M>(id: string): T;
    getAllFieldById<T = M>(id: string): T[];
    detectChanges(): void;
    get ready(): boolean;
    get root(): S;
    get fields(): M[];
    showField(visibility: Visibility | undefined): boolean;
}

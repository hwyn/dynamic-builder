import { Injector } from '@fm/di';
import { Visibility } from './consts';
import { BuilderField, BuilderModelImplements, CacheObj } from './type-api';
export declare class BuilderModel<S extends BuilderModelImplements = BuilderModelImplements, M extends BuilderField = BuilderField> implements BuilderModelImplements {
    id: string | undefined;
    parent: S | null;
    children: S[];
    $$cache: CacheObj;
    Element: any;
    injector: Injector;
    constructor();
    getFieldByTypes<T = M>(type: string): T[];
    getAllFieldByTypes<T = M>(type: string): T[];
    getFieldById<T = M>(id: string): T;
    getAllFieldById<T = M>(id: string): T[];
    detectChanges(): void;
    get listenerDetect(): import("rxjs").Subject<any>;
    get ready(): boolean;
    get root(): S;
    get fields(): M[];
    showField(visibility: Visibility | undefined): boolean;
}

import { LocatorStorage, Type } from '@fm/di';
import { Observable, Subject } from 'rxjs';
import { GridType } from '../builder-extension';
import { Action } from '../builder-extension/action';
import { Visibility } from './consts';
export interface CacheObj {
    [x: string]: any;
    lifeActions: {
        [key: string]: any;
    };
    fields: BuilderField[];
    destoryed: boolean;
    ready: boolean;
    destory: () => void;
    addChild: (child: BuilderModelImplements) => void;
    removeChild: (child: BuilderModelImplements) => void;
    detectChanges: Subject<any>;
    extensionDestorys: any[];
}
interface Field {
    [key: string]: any;
}
export interface Instance {
    current: any;
    destory: Subject<any>;
    onMounted: (id: string) => void;
    onDestory: (id: string) => void;
    detectChanges(): void;
}
export interface BuilderElement {
    instance?: any;
    builder?: BuilderModelImplements;
}
export interface BuilderField extends Field {
    id: string;
    type: string;
    element: any;
    field: Field;
    visibility?: Visibility;
}
export interface BuilderJsonField {
    id: string;
    type: string;
    actions?: Action[];
    [key: string]: any;
}
export declare type privateExtension = {
    extension: any;
    needExtends?: boolean;
};
export interface BuilderProps extends BuilderElement {
    id?: string;
    className?: string;
    builder?: BuilderModelImplements;
    BuilderModel?: Type<BuilderModelImplements>;
    privateExtension?: privateExtension[];
    events?: {
        [key: string]: (params?: any) => Observable<any>;
    };
    children?: any;
    jsonName?: string;
    jsonNameAction?: string;
    configAction?: string;
    style?: {
        [key: string]: string;
    };
    config?: BuilderJsonField[] | {
        grid?: GridType;
        fields: BuilderJsonField[];
        actions?: Action[];
    };
}
export declare interface Model<S, M> {
    parent: S | null;
    readonly root: S;
    readonly children: S[];
    readonly fields: M[];
    getFieldByTypes<T = M>(id: string): T[];
    getAllFieldByTypes<T = M>(id: string): T[];
    getFieldById<T = M>(id: string | undefined): T;
    getAllFieldById<T = M>(id: string): T[];
}
export declare interface BuilderModelInterface {
    readonly $$cache: CacheObj;
    readonly id: string | undefined;
    readonly ready: boolean | undefined;
    readonly grid?: GridType;
    readonly Element: any;
    readonly ls: LocatorStorage;
    readonly privateExtension?: privateExtension[];
    showField(visibility: Visibility | undefined): boolean;
    detectChanges(): void;
}
export interface BuilderModelImplements extends BuilderModelInterface, Model<BuilderModelImplements, BuilderField> {
}
export {};

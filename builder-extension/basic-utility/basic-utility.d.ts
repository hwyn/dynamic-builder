import { Injector } from '@fm/di';
import { BuilderJsonField, BuilderProps, CacheObj } from '../../builder';
import { Action } from '../action/type-api';
import { BuilderModelExtensions } from '../type-api';
export declare class BasicUtility {
    protected builder: BuilderModelExtensions;
    protected props: BuilderProps;
    protected cache: CacheObj;
    protected json: any;
    protected jsonFields: BuilderJsonField[];
    protected injector: Injector;
    constructor(builder: BuilderModelExtensions, props: BuilderProps, cache: CacheObj, json: any);
    protected get builderAttr(): string[];
    protected serializeAction(action: ((...args: any[]) => any) | string | Action): Action;
    protected getJsonFieldById(fieldId: string): any;
    protected isBuildField(props: any): boolean;
    protected getEventType(type: string): string;
    protected getActionType(type: string): string;
    protected toArray<T = any>(obj: any): T[];
    protected defineProperty(object: any, prototypeName: string, value: any): void;
    protected unDefineProperty(object: any, prototypeNames: string[]): void;
}

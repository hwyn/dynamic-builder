import { LocatorStorage } from '@fm/di';
import { BuilderFieldExtensions, BuilderModelExtensions, InstanceExtensions } from '../type-api';
import { Action, ActionIntercept, TypeEvent } from './type-api';
export declare class BaseAction<T = any> {
    protected ls: LocatorStorage;
    private context;
    constructor(ls: LocatorStorage, context?: any);
    get builderField(): BuilderFieldExtensions;
    get actionIntercept(): ActionIntercept;
    get builder(): BuilderModelExtensions;
    get instance(): InstanceExtensions;
    get actionPropos(): Action;
    get callLink(): [{
        fieldId: string;
        type: TypeEvent;
    }];
    get actionEvent(): T;
}

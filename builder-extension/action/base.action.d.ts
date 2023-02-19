import { Injector } from '@fm/di';
import { Observable } from 'rxjs';
import { BuilderFieldExtensions, BuilderModelExtensions, InstanceExtensions } from '../type-api';
import { Action, ActionIntercept, TypeEvent } from './type-api';
export declare abstract class BaseAction<T = any> {
    protected injector: Injector;
    private context;
    static cache?: boolean;
    constructor(injector: Injector, context?: any);
    protected abstract execute(baseAction?: BaseAction): T | Observable<T>;
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

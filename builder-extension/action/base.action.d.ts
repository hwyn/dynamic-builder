import { Observable } from 'rxjs';
import { BaseType } from '../context/base-type';
import { BuilderFieldExtensions, BuilderModelExtensions, InstanceExtensions } from '../type-api';
import { Action, ActionIntercept, TypeEvent } from './type-api';
export declare abstract class BaseAction<T = any> extends BaseType {
    static cache?: boolean;
    static actionName: string;
    private context;
    protected abstract execute(baseAction?: BaseAction): T | Observable<T>;
    protected invoke(context?: any): never;
    get builderField(): BuilderFieldExtensions;
    get actionIntercept(): ActionIntercept;
    get builder(): BuilderModelExtensions;
    get instance(): InstanceExtensions;
    get actionProps(): Action;
    get callLink(): [{
        fieldId: string;
        type: TypeEvent;
    }];
    get actionEvent(): T;
}

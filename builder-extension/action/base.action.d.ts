import { Observable } from 'rxjs';
import { BaseType } from '../context/base-type';
import { BuilderFieldExtensions, BuilderModelExtensions, InstanceExtensions } from '../type-api';
import { Action, ActionIntercept, CallLinkType } from './type-api';
export declare abstract class BaseAction<T = any> extends BaseType {
    static cache?: boolean;
    static actionName: string;
    private context;
    protected abstract execute(...params: any[]): T | Observable<T>;
    protected invoke<T extends BaseType>(context: any): T;
    get builderField(): BuilderFieldExtensions;
    get actionIntercept(): ActionIntercept;
    get builder(): BuilderModelExtensions;
    get instance(): InstanceExtensions;
    get actionProps(): Action;
    get callLink(): CallLinkType[];
    get actionEvent(): T;
}

import { Observable } from 'rxjs';
import { BuilderField, BuilderModelImplements } from '../../builder';
import { BuilderModelExtensions } from '../type-api';
import { BaseAction } from './base.action';
export declare type TypeEvent = 'load' | 'dataSource' | 'calculator-datasource' | 'calculator' | 'click' | 'change' | 'focus' | 'blur' | 'keyUp' | 'keyDown' | string;
export declare type ExecuteHandler = (baseAction: BaseAction, ...otherEvent: any[]) => any;
export interface ActionInterceptProps {
    builder: BuilderModelExtensions;
    id: string;
}
export interface Action {
    type: TypeEvent;
    name?: string | undefined;
    runObservable?: boolean;
    params?: any;
    stop?: boolean;
    handler?: ExecuteHandler;
    before?: Action;
    after?: Action;
}
export interface BuilderFieldAction extends BuilderField {
    actions: Action[];
    addEventListener: (actions: Action | Action[]) => any;
}
export interface ActionContext {
    builder?: BuilderModelImplements;
    builderField?: BuilderField;
}
export interface ActionIntercept {
    invoke(action: Action, props?: ActionInterceptProps, event?: any, otherEventParam?: any[]): Observable<any>;
    executeAction(action: string | Action, actionContext?: ActionContext, event?: Event | any, otherEventParam?: any[]): Observable<any>;
}

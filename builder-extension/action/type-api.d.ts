import { Observable } from 'rxjs';
import { BuilderField, BuilderModelImplements } from '../../builder';
import { BuilderModelExtensions } from '../type-api';
import { BaseAction } from './base.action';
export type TypeEvent = 'load' | 'dataSource' | 'calculator-datasource' | 'calculator' | 'click' | 'change' | 'focus' | 'blur' | 'keyUp' | 'keyDown' | string;
export type ExecuteHandler = (baseAction: BaseAction, ...otherEvent: any[]) => any;
export interface ActionInterceptProps {
    builder: BuilderModelExtensions;
    id: string;
}
export interface Action {
    type: TypeEvent;
    _uid?: string;
    name?: string | undefined;
    runObservable?: boolean;
    params?: any;
    stop?: boolean;
    handler?: ExecuteHandler;
    before?: Action;
    after?: Action;
}
export type InvokeAction = Action | string;
export interface BuilderFieldAction extends BuilderField {
    actions: Action[];
    addEventListener: (actions: Action | Action[]) => any;
}
export interface ActionContext {
    builder?: BuilderModelImplements;
    builderField?: BuilderField;
}
export interface ActionIntercept {
    callAction(actionName: InvokeAction, context: ActionInterceptProps, ...events: any[]): Observable<any>;
    invoke(action: Action | string, props?: ActionInterceptProps, event?: any, otherEventParam?: any[]): Observable<any>;
    executeAction(actionProps: Action, actionContext?: ActionContext, event?: any[]): Observable<any>;
}

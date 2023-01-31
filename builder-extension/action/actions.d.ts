import { Injector } from '@fm/di';
import { Observable } from 'rxjs';
import { Action as ActionProps, ActionContext, ActionIntercept, ActionInterceptProps, InvokeAction } from './type-api';
export declare class Action implements ActionIntercept {
    private injector;
    private actions;
    constructor(injector: Injector, actions: any[][]);
    private getAction;
    private createEvent;
    protected getActionContext({ builder, id }?: ActionInterceptProps): ActionContext;
    private call;
    private invokeCallCalculators;
    private invokeCalculators;
    private execute;
    private invokeAction;
    invoke(actions: InvokeAction | InvokeAction[], props?: ActionInterceptProps, event?: Event | any, ...otherEventParam: any[]): Observable<any>;
    callAction(actionName: InvokeAction, context: ActionInterceptProps, ...events: any[]): Observable<any>;
    executeAction(actionPropos: ActionProps, actionContext?: ActionContext, event?: any[]): Observable<any>;
}

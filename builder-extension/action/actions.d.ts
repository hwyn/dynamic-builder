import { Injector } from '@fm/di';
import { Observable } from 'rxjs';
import { Action as ActionProps, ActionContext, ActionIntercept, ActionInterceptProps, InvokeAction } from './type-api';
export declare class Action implements ActionIntercept {
    private injector;
    private actions;
    constructor(injector: Injector, actions: any[][]);
    private getAction;
    private getCacheAction;
    private createEvent;
    protected getActionContext({ builder, id }?: ActionInterceptProps): ActionContext;
    private call;
    private invokeCallCalculators;
    private invokeCalculators;
    private execute;
    invoke(actions: InvokeAction | InvokeAction[], props?: ActionInterceptProps, event?: Event | any, ...otherEventParam: any[]): Observable<any>;
    callAction(actionName: InvokeAction, context: ActionInterceptProps, ...events: any[]): Observable<any>;
    executeAction(actionPropos: ActionProps, actionContext?: ActionContext, [actionEvent, ...otherEvent]?: any[]): Observable<any>;
}

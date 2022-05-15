import { LocatorStorage } from '@fm/di';
import { Observable } from 'rxjs';
import { Action as ActionProps, ActionContext, ActionIntercept, ActionInterceptProps } from './type-api';
export declare class Action implements ActionIntercept {
    private ls;
    private actions;
    constructor(ls: LocatorStorage, actions: any[][]);
    private getAction;
    private createEvent;
    protected getActionContext({ builder, id }?: ActionInterceptProps): ActionContext;
    private call;
    private invokeCallCalculators;
    private invokeCalculators;
    private invokeAction;
    invoke(actions: ActionProps | ActionProps[], props?: ActionInterceptProps, event?: Event | any, ...otherEventParam: any[]): Observable<any>;
    executeAction(actionPropos: ActionProps, actionContext?: ActionContext, event?: any[]): Observable<any>;
}

import { Injector, MethodProxy } from '@hwy-fm/di';
import { Observable } from 'rxjs';
import { Action as ActionProps, ActionContext, ActionIntercept, ActionInterceptProps, CallLinkType, InvokeAction } from './type-api';
type ActionLinkProps = ActionProps & {
    callLink?: CallLinkType[];
};
export declare class Action implements ActionIntercept {
    private readonly mp;
    private readonly injector;
    private readonly getType;
    constructor(mp: MethodProxy, injector: Injector, getType: any);
    private getCacheAction;
    private createEvent;
    protected createCallLinkType({ type, callLink }: ActionLinkProps, { id }: ActionInterceptProps, input: any, out: any): CallLinkType[];
    protected getActionContext({ builder, id }?: ActionInterceptProps): ActionContext;
    private execute;
    invoke(actions: InvokeAction | InvokeAction[], props?: ActionInterceptProps, event?: Event | any, ...otherEvent: any[]): Observable<any>;
    callAction(actionName: InvokeAction, context: ActionInterceptProps, ...events: any[]): Observable<any>;
    executeAction(actionProps: ActionProps, actionContext?: ActionContext, [actionEvent, ...otherEvent]?: any[]): Observable<any>;
}
export {};

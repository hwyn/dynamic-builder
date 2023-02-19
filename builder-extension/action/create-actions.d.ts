import { Injector } from '@fm/di';
import { Action, ActionInterceptProps } from './type-api';
export interface CreateOptions {
    injector: Injector;
    interceptFn?: (...args: any[]) => any;
}
declare type Actions = {
    [key: string]: (event?: Event, ...arg: any[]) => any;
};
export declare function getEventType(type: string): string;
export declare function getActionType(type: string): string;
export declare const createActions: (actions: Action[], props: ActionInterceptProps, options: CreateOptions) => Actions;
export {};

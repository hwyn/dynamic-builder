import { LocatorStorage } from '@fm/di';
import { Action, ActionInterceptProps } from './type-api';
export interface CreateOptions {
    ls: LocatorStorage;
    interceptFn?: (...args: any[]) => any;
}
export declare function getEventType(type: string): string;
export declare const createActions: (actions: Action[], props: ActionInterceptProps, options: CreateOptions) => {
    [key: string]: (event?: Event, ...arg: any[]) => any;
};

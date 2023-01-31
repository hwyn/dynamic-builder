import { Injector } from '@fm/di';
import { Observable } from 'rxjs';
import { BuilderProps, CacheObj } from '../../builder';
import { Action, ActionInterceptProps, BaseAction } from '../action';
import { CreateOptions } from '../action/create-actions';
import { BuilderFieldExtensions, BuilderModelExtensions, Calculators, CalculatorsDependent } from '../type-api';
export declare type CallBackOptions = [any, BuilderFieldExtensions];
declare type CallBack = (options: CallBackOptions) => any;
export declare const serializeAction: (action: string | Action | ((...args: any[]) => any)) => Action;
export declare abstract class BasicExtension {
    protected builder: BuilderModelExtensions;
    protected props: BuilderProps;
    protected cache: CacheObj;
    protected json: any;
    protected jsonFields: any[];
    protected injector: Injector;
    constructor(builder: BuilderModelExtensions, props: BuilderProps, cache: CacheObj, json: any);
    protected abstract extension(): void | Observable<any>;
    protected afterExtension(): void;
    protected beforeDestory(): void | Observable<any>;
    protected destory(): void | Observable<any>;
    init(): Observable<BasicExtension>;
    afterInit(): Observable<() => void>;
    protected eachFields(jsonFields: any[], callBack: CallBack): void;
    protected mapFields<T = BuilderFieldExtensions>(jsonFields: any[], callBack: CallBack): T[];
    protected serializeCalculatorConfig(jsonCalculator: any, actionType: string, defaultDependents: CalculatorsDependent | CalculatorsDependent[]): any;
    protected bindCalculatorAction(handler: (baseAction: BaseAction) => any): Action;
    protected pushCalculators(fieldConfig: BuilderFieldExtensions, calculator: Calculators | Calculators[]): void;
    protected pushAction(fieldConfig: BuilderFieldExtensions, actions: Action | Action[]): void;
    protected pushActionToMethod(actions: Action | Action[]): void;
    protected toArray<T = any>(obj: any): T[];
    protected defineProperty(object: any, prototypeName: string, value: any): void;
    protected definePropertys(object: any, prototype: {
        [key: string]: any;
    }): void;
    protected definePropertyGet(object: any, prototypeName: string, get: () => any): void;
    protected unDefineProperty(object: any, prototypeNames: string[]): void;
    protected serializeAction(action: ((...args: any[]) => any) | string | Action): Action;
    protected createActions(actions: Action[], props: ActionInterceptProps, options: CreateOptions): {
        [key: string]: (event?: Event, ...arg: any[]) => any;
    };
    protected getEventType(type: string): string;
    protected getJsonFieldById(fieldId: string): any;
    protected getBuilderFieldById(fieldId: string): BuilderFieldExtensions;
}
export {};

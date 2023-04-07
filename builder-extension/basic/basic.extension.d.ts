import { Injector } from '@fm/di';
import { Observable } from 'rxjs';
import { BuilderProps, CacheObj } from '../../builder';
import { Action, ActionInterceptProps, BaseAction } from '../action';
import { CreateOptions } from '../action/create-actions';
import { BuilderFieldExtensions, BuilderModelExtensions, Calculators, CalculatorsDependent } from '../type-api';
export type CallBackOptions = [any, BuilderFieldExtensions];
type CallBack = (options: CallBackOptions) => any;
export declare const serializeAction: (action: string | Action | ((...args: any[]) => any)) => Action;
export declare abstract class BasicExtension {
    protected builder: BuilderModelExtensions;
    protected props: BuilderProps;
    protected cache: CacheObj;
    protected json: any;
    protected jsonFields: any[];
    protected injector: Injector;
    constructor(builder: BuilderModelExtensions, props: BuilderProps, cache: CacheObj, json: any);
    protected get builderAttr(): string[];
    protected beforeExtension(): void;
    protected abstract extension(): void | Observable<any>;
    protected afterExtension(): void;
    protected beforeDestroy(): void | Observable<any>;
    protected destroy(): void | Observable<any>;
    init(): Observable<BasicExtension>;
    afterInit(): Observable<() => void>;
    protected eachFields(jsonFields: any[], callBack: CallBack): void;
    protected mapFields<T = BuilderFieldExtensions>(jsonFields: any[], callBack: CallBack): T[];
    protected isBuildField(props: any): boolean;
    protected cloneDeepPlain<T>(value: T): T;
    protected serializeCalculatorConfig(jsonCalculator: any, actionType: string, defaultDependents: CalculatorsDependent | CalculatorsDependent[]): any;
    protected bindCalculatorAction(handler: (baseAction: BaseAction) => any, type?: string): Action;
    protected pushCalculators(fieldConfig: BuilderFieldExtensions, calculator: Calculators | Calculators[]): void;
    protected pushAction(fieldConfig: BuilderFieldExtensions, actions: Action | Action[]): void;
    protected toArray<T = any>(obj: any): T[];
    protected defineProperty(object: any, prototypeName: string, value: any): void;
    protected defineProperties(object: any, prototype: {
        [key: string]: any;
    }): void;
    protected definePropertyGet(object: any, prototypeName: string, get: () => any): void;
    protected unDefineProperty(object: any, prototypeNames: string[]): void;
    protected serializeAction(action: ((...args: any[]) => any) | string | Action): Action;
    protected pushActionToMethod(actions: Action | Action[]): void;
    protected createLifeActionEvents(actions: Action | Action[]): ((event?: Event, ...arg: any[]) => any)[];
    protected createLifeActions(actions: Action | Action[]): {
        [key: string]: (event?: Event, ...arg: any[]) => any;
    };
    protected createActions(actions: Action[], props: ActionInterceptProps, options: CreateOptions): {
        [key: string]: (event?: Event, ...arg: any[]) => any;
    };
    protected getEventType(type: string): string;
    protected getActionType(type: string): string;
    protected getJsonFieldById(fieldId: string): any;
    protected getBuilderFieldById(fieldId: string): BuilderFieldExtensions;
}
export {};

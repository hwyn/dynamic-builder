import { Observable } from 'rxjs';
import { BuilderProps, CacheObj } from '../../builder';
import { Action, ActionInterceptProps, BaseAction } from '../action';
import { CreateOptions } from '../action/create-actions';
import { BasicUtility } from '../basic-utility/basic-utility';
import { BuilderFieldExtensions, BuilderModelExtensions, Calculators, CalculatorsDependent } from '../type-api';
export type CallBackOptions = [any, BuilderFieldExtensions];
type CallBack = (options: CallBackOptions) => any;
export declare abstract class BasicExtension extends BasicUtility {
    constructor(builder: BuilderModelExtensions, props: BuilderProps, cache: CacheObj, json: any);
    protected beforeExtension(): void;
    protected abstract extension(): void | Observable<any>;
    protected afterExtension(): void;
    protected beforeDestroy(): void | Observable<any>;
    protected destroy(): void | Observable<any>;
    init(): Observable<BasicExtension>;
    afterInit(): Observable<() => void>;
    protected eachFields(jsonFields: any[], callBack: CallBack): void;
    protected mapFields<T = BuilderFieldExtensions>(jsonFields: any[], callBack: CallBack): T[];
    protected cloneDeepPlain<T>(value: T): T;
    protected serializeCalculatorConfig(jsonCalculator: any, actionType: string, defaultDependents: CalculatorsDependent | CalculatorsDependent[]): any;
    protected bindCalculatorAction(handler: (baseAction: BaseAction) => any, type?: string): Action;
    protected pushCalculators(fieldConfig: BuilderFieldExtensions, calculator: Calculators | Calculators[]): void;
    protected pushAction(fieldConfig: BuilderFieldExtensions, actions: Action | Action[]): void;
    protected defineProperties(object: any, prototype: {
        [key: string]: any;
    }): void;
    protected definePropertyGet(object: any, prototypeName: string, get: () => any): void;
    protected pushActionToMethod(actions: Action | Action[]): void;
    protected createLifeActionEvents(actions: Action | Action[]): ((event?: Event, ...arg: any[]) => any)[];
    protected createLifeActions(actions: Action | Action[]): {
        [key: string]: (event?: Event, ...arg: any[]) => any;
    };
    protected createActions(actions: Action[], props: ActionInterceptProps, options: CreateOptions): {
        [key: string]: (event?: Event, ...arg: any[]) => any;
    };
    protected getBuilderFieldById(fieldId: string): BuilderFieldExtensions;
}
export {};

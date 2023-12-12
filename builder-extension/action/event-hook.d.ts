import { BuilderProps, CacheObj } from '../../builder';
import { BasicUtility } from '../basic-utility/basic-utility';
import { BuilderModelExtensions, OriginCalculators } from '../type-api';
import { Action as ActionProps, ActionIntercept, ActionInterceptProps, CallLinkType } from './type-api';
type ActionLinkProps = ActionProps & {
    callLink?: CallLinkType[];
};
export declare class EventHook extends BasicUtility {
    protected calculators: OriginCalculators[];
    protected nonSelfCalculators: OriginCalculators[];
    protected actionIntercept: ActionIntercept;
    static create(builder: BuilderModelExtensions, props: BuilderProps, cache: CacheObj, json: any): EventHook;
    constructor(builder: BuilderModelExtensions, props: BuilderProps, cache: CacheObj, json: any);
    serializeCalculators(): void;
    invokeCalculators(actionProps: ActionProps, props: ActionInterceptProps, callLink: CallLinkType[], ...events: any[]): import("rxjs").Observable<any[]>;
    protected linkCalculators(calculators: OriginCalculators[]): void;
    protected linkCalculator(calculator: OriginCalculators, nonSelfCalculator?: boolean): void;
    protected linkOtherCalculator(calculator: OriginCalculators): void;
    protected call(calculators: OriginCalculators[], builder: BuilderModelExtensions): (callLink: CallLinkType[], value: any, ...other: any[]) => import("rxjs").Observable<any[]>;
    protected invokeCallCalculators(calculators: OriginCalculators[], { type }: ActionLinkProps, props: ActionInterceptProps): ((callLink: CallLinkType[], value: any, ...other: any[]) => import("rxjs").Observable<any[]>) | ((_callLink: CallLinkType[], value: any) => import("rxjs").Observable<any>);
    protected getEventHook(builder: BuilderModelExtensions): any;
    protected getNonSelfCalculators(): OriginCalculators[];
    protected pushNonBuilders(): void;
    protected get nonSelfBuilders(): BuilderModelExtensions[];
    destroy(): void;
}
export {};

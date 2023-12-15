import { Observable, Subject } from 'rxjs';
import { BuilderProps } from '../../builder';
import { BasicExtension } from '../basic/basic.extension';
import { BuilderModelExtensions, OriginCalculators } from '../type-api';
export declare class LifeCycleExtension extends BasicExtension {
    protected lifeEvent: string[];
    protected calculators: OriginCalculators[];
    protected nonSelfCalculators: OriginCalculators[];
    protected parentDestroy: Subject<unknown>;
    protected lifeActions: {
        [key: string]: (event?: Event, ...arg: any[]) => any;
    };
    protected extension(): void;
    protected callParentDestroy(parentBuilder: BuilderModelExtensions): void;
    protected createLoadAction(json: any): any;
    protected createLife(): Observable<any>;
    protected onLifeChange(onChange: any, props: BuilderProps): void;
    protected invokeLifeCycle(type: string, event?: any, otherEvent?: any): Observable<any>;
    protected notifyParentDestroy(): void;
    protected beforeDestroy(): Observable<any>;
    protected destroy(): Observable<any>;
}

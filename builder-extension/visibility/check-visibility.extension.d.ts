import { BaseAction } from '../action';
import { BasicExtension } from '../basic/basic.extension';
export declare function createCheckVisibility(): ({ builder }: BaseAction) => void;
export declare class CheckVisibilityExtension extends BasicExtension {
    protected extension(): void;
    private createDependents;
    private addFieldCalculators;
    private serializeCheckVisibilityConfig;
    private checkVisibilityAfter;
    private removeOnEvent;
    private checkNeedOrDefaultVisibility;
    protected destroy(): void | import("rxjs").Observable<any>;
}

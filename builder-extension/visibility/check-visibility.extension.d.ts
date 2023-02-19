import { BasicExtension } from '../basic/basic.extension';
export declare class CheckVisibilityExtension extends BasicExtension {
    private builderFields;
    protected extension(): void;
    private createDependents;
    private addFieldCalculators;
    private serializeCheckVisibilityConfig;
    private checkVisibilityAfter;
    private removeOnEvent;
    private checkVisibility;
    private filterNoneCalculators;
    private checkNeedOrDefaultVisibility;
    private getParentVisibility;
    protected destory(): void | import("rxjs").Observable<any>;
}

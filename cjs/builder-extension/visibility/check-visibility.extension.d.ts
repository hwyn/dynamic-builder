import { BasicExtension } from '../basic/basic.extension';
export declare class CheckVisibilityExtension extends BasicExtension {
    private visibilityTypeName;
    private builderFields;
    private defaultDependents;
    protected extension(): void;
    private addFieldCalculators;
    private serializeCheckVisibilityConfig;
    private checkVisibilityAfter;
    private removeOnEvent;
    private checkVisibility;
    private filterNoneCalculators;
    private checkNeedOrDefaultVisibility;
    private getParentVisibility;
}

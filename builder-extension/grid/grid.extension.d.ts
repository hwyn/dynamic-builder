import { BasicExtension } from '../basic/basic.extension';
export declare class GridExtension extends BasicExtension {
    private layoutBuildFields;
    private getLayoutElement;
    protected extension(): void;
    private createLoadGrid;
    private addFieldLayout;
    protected destory(): void | import("rxjs").Observable<any>;
}

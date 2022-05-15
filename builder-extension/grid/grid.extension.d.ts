import { BasicExtension } from '../basic/basic.extension';
export declare class GridExtension extends BasicExtension {
    private layoutBuildFields;
    protected extension(): void;
    private createLoadGrid;
    private addFieldLayout;
    private createGrid;
    protected destory(): void | import("rxjs").Observable<any>;
}

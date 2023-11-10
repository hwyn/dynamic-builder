import { BasicExtension } from '../basic/basic.extension';
export declare class GridExtension extends BasicExtension {
    private builderFields;
    private layoutBuildFields;
    private getGrid;
    private getLayoutElement;
    protected extension(): void;
    private createLoadGrid;
    private addLayoutElement;
    private addFieldLayout;
    protected destroy(): void | import("rxjs").Observable<any>;
}

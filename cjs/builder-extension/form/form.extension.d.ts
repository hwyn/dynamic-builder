import { BasicExtension } from '../basic/basic.extension';
export declare class FormExtension extends BasicExtension {
    private builderFields;
    private defaultChangeType;
    protected extension(): void;
    private createMergeControl;
    private addControl;
    private createChange;
    private createValidaity;
    private createVisibility;
    private changeVisibility;
    private excuteChangeEvent;
    private createNotifyChange;
    private getChangeType;
    private getValueToModel;
    private setValueToModel;
    private isDomEvent;
    destory(): void | import("rxjs/internal/Observable").Observable<any>;
}

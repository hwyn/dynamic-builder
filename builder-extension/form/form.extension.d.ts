import { BasicExtension } from '../basic/basic.extension';
export declare class FormExtension extends BasicExtension {
    private builderFields;
    private defaultChangeType;
    private getControl;
    protected extension(): void;
    private createMergeControl;
    private addChangeAction;
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
    destory(): void | import("rxjs").Observable<any>;
}

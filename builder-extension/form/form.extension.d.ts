import { BasicExtension } from '../basic/basic.extension';
export declare class FormExtension extends BasicExtension {
    private convertMap;
    private builderFields;
    private defaultChangeType;
    private getControl;
    private convertIntercept;
    protected extension(): void;
    private createMergeControl;
    private addChangeAction;
    private addControl;
    private createChange;
    private createVisibility;
    private changeVisibility;
    private executeChangeEvent;
    private createNotifyChange;
    private detectChanges;
    private getChangeType;
    private getValueToModel;
    private setValueToModel;
    private deleteValueToModel;
    private isDomEvent;
    destroy(): void | import("rxjs").Observable<any>;
}

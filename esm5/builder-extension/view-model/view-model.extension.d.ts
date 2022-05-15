import { BasicExtension } from '../basic/basic.extension';
export declare class ViewModelExtension extends BasicExtension {
    protected extension(): void;
    private createViewModelCalculator;
    private createViewModel;
    private createNotifyEvent;
    private notifyHandler;
    private refresHandler;
    protected destory(): void | import("rxjs/internal/Observable").Observable<any>;
}

import { BasicExtension } from '../basic/basic.extension';
export declare class ViewModelExtension extends BasicExtension {
    protected extension(): void;
    private createViewModelCalculator;
    private createViewModel;
    private createNotifyEvent;
    private notifyHandler;
    private refreshHandler;
    protected destroy(): void | import("rxjs").Observable<any>;
}

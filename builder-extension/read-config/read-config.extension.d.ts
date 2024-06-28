import { Observable } from 'rxjs';
import { BasicExtension } from '../basic/basic.extension';
export declare class ReadConfigExtension extends BasicExtension {
    private getJsonConfig;
    protected extension(): Observable<any>;
    private getConfig;
    private preloaded;
    private preloadedBuildField;
    private getConfigJson;
    private getConfigObservable;
    private createLoadConfigAction;
    private checkFieldRepeat;
    private eligiblePreloaded;
    private createGetExecuteHandler;
    protected destroy(): void | Observable<any>;
}

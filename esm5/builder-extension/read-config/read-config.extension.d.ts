import { Observable } from '@fm/import-rxjs';
import { BasicExtension } from "../basic/basic.extension";
export declare class ReadConfigExtension extends BasicExtension {
    protected extension(): void | Observable<any>;
    private extendsConfig;
    private preloaded;
    private preloadedBuildField;
    private getConfigJson;
    private getConfigObservable;
    private createLoadConfigAction;
    private checkFieldRepeat;
    private eligiblePreloaded;
    private createGetExecuteHandler;
    protected destory(): void | Observable<any>;
}

import { Observable } from 'rxjs';
import { Instance } from '../../builder';
import { BasicExtension } from '../basic/basic.extension';
export declare class InstanceExtension extends BasicExtension {
    private buildFieldList;
    static createInstance(): Instance;
    protected extension(): void;
    private createInstanceLife;
    private getCurrentProperty;
    private addInstance;
    private instanceDestroy;
    protected beforeDestroy(): Observable<any>;
    destroy(): void | Observable<any>;
}

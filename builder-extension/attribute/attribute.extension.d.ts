import { Observable } from 'rxjs';
import { BaseAction } from '../action';
import { BasicExtension } from '../basic/basic.extension';
export declare class AttributeExtension extends BasicExtension {
    private inherent;
    protected extension(): void | Observable<any>;
    private addCalculator;
    updateAttr(key: string, { builderField, actionEvent, instance }: BaseAction): void;
}

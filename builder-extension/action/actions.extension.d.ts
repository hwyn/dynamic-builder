import { BasicExtension } from '../basic/basic.extension';
export declare class ActionExtension extends BasicExtension {
    private fields;
    protected beforeExtension(): void;
    protected extension(): void;
    private create;
    private addFieldEvent;
    destory(): void;
}

import { BasicExtension } from '../basic/basic.extension';
export declare class ActionExtension extends BasicExtension {
    private fields;
    protected beforeExtension(): void;
    protected extension(): void;
    protected afterExtension(): void;
    protected parseActions(actions: any): any;
    private create;
    private addFieldEvent;
    destroy(): void;
}

import { BuilderFieldExtensions } from '../type-api';
export type notifyOptions = {
    hasSelf: boolean;
};
export declare interface BuilderViewModel {
    readonly viewModel?: any;
    refreshData(model: any): void;
    notifyModelChanges(builderField?: BuilderFieldExtensions, options?: notifyOptions): void;
}

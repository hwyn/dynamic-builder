import { BuilderModel } from '../../builder/builder-model';
import { BuilderFieldExtensions, BuilderModelExtensions as ModelExtensions } from '../type-api';
export declare class BuilderModelExtensions extends BuilderModel<ModelExtensions, BuilderFieldExtensions> {
    readonly viewModel?: any;
    refreshData: (model: any) => void;
    refreshVisibility: (builderField?: BuilderFieldExtensions) => void;
    notifyModelChanges: (builderField?: BuilderFieldExtensions, options?: {
        hasSelf: boolean;
    }) => void;
}

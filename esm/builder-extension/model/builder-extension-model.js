import { __decorate } from "tslib";
import { BuilderModel } from '../../builder/builder-model';
import { DynamicModel } from '../../builder/decorator';
let BuilderModelExtensions = class BuilderModelExtensions extends BuilderModel {
};
BuilderModelExtensions = __decorate([
    DynamicModel()
], BuilderModelExtensions);
export { BuilderModelExtensions };

import { __decorate } from "tslib";
import { BuilderModel } from './builder-model';
import { DynamicModel } from './decorator';
let BuilderScope = class BuilderScope extends BuilderModel {
    destroy() {
        this.injector.destroy();
    }
};
BuilderScope = __decorate([
    DynamicModel()
], BuilderScope);
export { BuilderScope };

import { __decorate, __extends } from "tslib";
import { BuilderModel } from '../../builder/builder-model';
import { DynamicModel } from '../../builder/decorator';
var BuilderModelExtensions = /** @class */ (function (_super) {
    __extends(BuilderModelExtensions, _super);
    function BuilderModelExtensions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuilderModelExtensions = __decorate([
        DynamicModel()
    ], BuilderModelExtensions);
    return BuilderModelExtensions;
}(BuilderModel));
export { BuilderModelExtensions };

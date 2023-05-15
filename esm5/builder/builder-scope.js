import { __decorate, __extends } from "tslib";
import { BuilderModel } from './builder-model';
import { DynamicModel } from './decorator';
var BuilderScope = /** @class */ (function (_super) {
    __extends(BuilderScope, _super);
    function BuilderScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuilderScope.prototype.destroy = function () {
        this.injector.destroy();
    };
    BuilderScope = __decorate([
        DynamicModel()
    ], BuilderScope);
    return BuilderScope;
}(BuilderModel));
export { BuilderScope };

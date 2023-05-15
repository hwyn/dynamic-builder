"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderScope = void 0;
var tslib_1 = require("tslib");
var builder_model_1 = require("./builder-model");
var decorator_1 = require("./decorator");
var BuilderScope = /** @class */ (function (_super) {
    tslib_1.__extends(BuilderScope, _super);
    function BuilderScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuilderScope.prototype.destroy = function () {
        this.injector.destroy();
    };
    BuilderScope = tslib_1.__decorate([
        (0, decorator_1.DynamicModel)()
    ], BuilderScope);
    return BuilderScope;
}(builder_model_1.BuilderModel));
exports.BuilderScope = BuilderScope;

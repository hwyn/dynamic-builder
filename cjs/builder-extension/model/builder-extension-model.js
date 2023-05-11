"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderModelExtensions = void 0;
var tslib_1 = require("tslib");
var builder_model_1 = require("../../builder/builder-model");
var decorator_1 = require("../../builder/decorator");
var BuilderModelExtensions = /** @class */ (function (_super) {
    tslib_1.__extends(BuilderModelExtensions, _super);
    function BuilderModelExtensions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuilderModelExtensions = tslib_1.__decorate([
        (0, decorator_1.DynamicModel)()
    ], BuilderModelExtensions);
    return BuilderModelExtensions;
}(builder_model_1.BuilderModel));
exports.BuilderModelExtensions = BuilderModelExtensions;

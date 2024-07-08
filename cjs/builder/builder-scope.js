"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderScope = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@hwy-fm/di");
var lodash_1 = require("lodash");
var token_1 = require("../token");
var builder_model_1 = require("./builder-model");
var decorator_1 = require("./decorator");
var BuilderScope = /** @class */ (function (_super) {
    tslib_1.__extends(BuilderScope, _super);
    function BuilderScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuilderScope.prototype.onChange = function (props) {
        var metaType = this.injector.get(token_1.META_TYPE);
        if (this.ready && !this.$$cache.destroyed) {
            this.scopeProps._props = this.scopeProps.props;
            this.scopeProps.props = props;
            this.injector.get(token_1.META_PROPS, di_1.InjectFlags.NonCache);
        }
        metaType.onChange && metaType.onChange(props);
    };
    BuilderScope.prototype.resetMetaTypeProps = function () {
        var metaType = this.injector.get(token_1.META_TYPE);
        var _a = this.scopeProps, _b = _a._props, _props = _b === void 0 ? {} : _b, props = _a.props;
        var metadata = di_1.reflectCapabilities.properties(Object.getPrototypeOf(metaType).constructor);
        var updateMetadata = {};
        Object.keys(metadata).forEach(function (prop) {
            var _a;
            var inputMetadata = metadata[prop].find(function (_a) {
                var metadataName = _a.metadataName;
                return decorator_1.INPUT_PROPS === metadataName;
            });
            if (inputMetadata) {
                var attr = (_a = inputMetadata === null || inputMetadata === void 0 ? void 0 : inputMetadata.key) !== null && _a !== void 0 ? _a : prop;
                if ((0, lodash_1.get)(_props, attr) !== (0, lodash_1.get)(props, attr))
                    updateMetadata[prop] = metadata[prop];
            }
        });
        (0, di_1.propArgs)(metaType, updateMetadata);
    };
    BuilderScope.prototype.destroy = function () {
        this.injector.destroy();
    };
    tslib_1.__decorate([
        (0, di_1.Inject)(token_1.SCOPE_PROPS),
        tslib_1.__metadata("design:type", Object)
    ], BuilderScope.prototype, "scopeProps", void 0);
    BuilderScope = tslib_1.__decorate([
        (0, decorator_1.DynamicModel)()
    ], BuilderScope);
    return BuilderScope;
}(builder_model_1.BuilderModel));
exports.BuilderScope = BuilderScope;

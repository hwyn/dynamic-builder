import { __decorate, __extends, __metadata } from "tslib";
import { Inject, InjectFlags, propArgs, reflectCapabilities } from '@fm/di';
import { META_PROPS, META_TYPE, SCOPE_PROPS } from '../token';
import { BuilderModel } from './builder-model';
import { DynamicModel } from './decorator';
var BuilderScope = /** @class */ (function (_super) {
    __extends(BuilderScope, _super);
    function BuilderScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuilderScope.prototype.onChange = function (props) {
        if (this.ready && !this.$$cache.destroyed) {
            this.scopeProps._props = this.scopeProps.props;
            this.scopeProps.props = props;
            this.injector.get(META_PROPS, InjectFlags.NonCache);
        }
    };
    BuilderScope.prototype.resetMetaTypeProps = function () {
        var metaType = this.injector.get(META_TYPE);
        var _a = this.scopeProps, _b = _a._props, _props = _b === void 0 ? {} : _b, props = _a.props;
        var metadata = reflectCapabilities.properties(Object.getPrototypeOf(metaType).constructor);
        var updateMetadata = {};
        Object.keys(metadata).forEach(function (prop) {
            if (_props[prop] !== props[prop])
                updateMetadata[prop] = metadata[prop];
        });
        propArgs(metaType, updateMetadata);
    };
    BuilderScope.prototype.destroy = function () {
        this.injector.destroy();
    };
    __decorate([
        Inject(SCOPE_PROPS),
        __metadata("design:type", Object)
    ], BuilderScope.prototype, "scopeProps", void 0);
    BuilderScope = __decorate([
        DynamicModel()
    ], BuilderScope);
    return BuilderScope;
}(BuilderModel));
export { BuilderScope };

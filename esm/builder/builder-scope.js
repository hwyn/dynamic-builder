import { __decorate, __metadata } from "tslib";
import { Inject, InjectFlags, propArgs, reflectCapabilities } from '@fm/di';
import { META_PROPS, META_TYPE, SCOPE_PROPS } from '../token';
import { BuilderModel } from './builder-model';
import { DynamicModel } from './decorator';
let BuilderScope = class BuilderScope extends BuilderModel {
    onChange(props) {
        if (this.ready && !this.$$cache.destroyed) {
            this.scopeProps._props = this.scopeProps.props;
            this.scopeProps.props = props;
            this.injector.get(META_PROPS, InjectFlags.NonCache);
        }
    }
    resetMetaTypeProps() {
        const metaType = this.injector.get(META_TYPE);
        const { _props = {}, props } = this.scopeProps;
        const metadata = reflectCapabilities.properties(Object.getPrototypeOf(metaType).constructor);
        const updateMetadata = {};
        Object.keys(metadata).forEach((prop) => {
            if (_props[prop] !== props[prop])
                updateMetadata[prop] = metadata[prop];
        });
        propArgs(metaType, updateMetadata);
    }
    destroy() {
        this.injector.destroy();
    }
};
__decorate([
    Inject(SCOPE_PROPS),
    __metadata("design:type", Object)
], BuilderScope.prototype, "scopeProps", void 0);
BuilderScope = __decorate([
    DynamicModel()
], BuilderScope);
export { BuilderScope };

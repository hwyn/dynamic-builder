import { __decorate, __metadata } from "tslib";
import { Inject, InjectFlags, propArgs, reflectCapabilities } from '@hwy-fm/di';
import { get } from 'lodash';
import { META_PROPS, META_TYPE, SCOPE_PROPS } from '../token';
import { BuilderModel } from './builder-model';
import { DynamicModel, INPUT_PROPS } from './decorator';
let BuilderScope = class BuilderScope extends BuilderModel {
    onChange(props) {
        const metaType = this.injector.get(META_TYPE);
        if (this.ready && !this.$$cache.destroyed) {
            this.scopeProps._props = this.scopeProps.props;
            this.scopeProps.props = props;
            this.injector.get(META_PROPS, InjectFlags.NonCache);
        }
        metaType.onChange && metaType.onChange(props);
    }
    resetMetaTypeProps() {
        const metaType = this.injector.get(META_TYPE);
        const { _props = {}, props } = this.scopeProps;
        const metadata = reflectCapabilities.properties(Object.getPrototypeOf(metaType).constructor);
        const updateMetadata = {};
        Object.keys(metadata).forEach((prop) => {
            var _a;
            const inputMetadata = metadata[prop].find(({ metadataName }) => INPUT_PROPS === metadataName);
            if (inputMetadata) {
                const attr = (_a = inputMetadata === null || inputMetadata === void 0 ? void 0 : inputMetadata.key) !== null && _a !== void 0 ? _a : prop;
                if (get(_props, attr) !== get(props, attr))
                    updateMetadata[prop] = metadata[prop];
            }
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

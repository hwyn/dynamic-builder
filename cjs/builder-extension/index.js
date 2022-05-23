"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeAction = exports.BuilderModel = exports.Grid = exports.InjectableValidator = exports.registryExtension = exports.forwardBuilderLayout = exports.forwardFormControl = exports.forwardGetJsonConfig = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
// eslint-disable-next-line max-len
const token_1 = require("../token");
const actions_1 = require("./action/actions");
const actions_extension_1 = require("./action/actions.extension");
const basic_extension_1 = require("./basic/basic.extension");
Object.defineProperty(exports, "serializeAction", { enumerable: true, get: function () { return basic_extension_1.serializeAction; } });
const datasource_extension_1 = require("./datasource/datasource.extension");
const form_extension_1 = require("./form/form.extension");
const grid_extension_1 = require("./grid/grid.extension");
const instance_extension_1 = require("./instance/instance.extension");
const life_cycle_extension_1 = require("./life-cycle/life-cycle.extension");
const metadata_extension_1 = require("./metadata/metadata.extension");
const read_config_extension_1 = require("./read-config/read-config.extension");
const view_model_extension_1 = require("./view-model/view-model.extension");
const check_visibility_extension_1 = require("./visibility/check-visibility.extension");
const registryFactory = (token, useFactory) => {
    const proxyUseFactory = (ls, ...args) => useFactory(...args, ls);
    (0, di_1.registryProvider)({ provide: token, useFactory: proxyUseFactory, deps: [di_1.LocatorStorage] });
};
const forwardGetJsonConfig = (getJsonConfig) => {
    registryFactory(token_1.GET_JSON_CONFIG, getJsonConfig);
};
exports.forwardGetJsonConfig = forwardGetJsonConfig;
const forwardFormControl = (factoryFormControl) => {
    registryFactory(token_1.BIND_FORM_CONTROL, (value, options, ls) => {
        return factoryFormControl(value, ls.getProvider(token_1.VALIDATOR_SERVICE)?.getValidators(options), ls);
    });
};
exports.forwardFormControl = forwardFormControl;
const forwardBuilderLayout = (createElement) => {
    registryFactory(token_1.BIND_BUILDER_ELEMENT, createElement);
};
exports.forwardBuilderLayout = forwardBuilderLayout;
const registryExtension = (extensions) => {
    (0, di_1.registryProvider)(extensions.map((extension) => ({ provide: token_1.BUILDER_EXTENSION, multi: true, useValue: extension })));
};
exports.registryExtension = registryExtension;
const InjectableValidator = () => (0, di_1.Injectable)(token_1.VALIDATOR_SERVICE);
exports.InjectableValidator = InjectableValidator;
(0, di_1.registryProvider)([
    { provide: token_1.ACTION_INTERCEPT, useClass: actions_1.Action },
    { provide: token_1.LOAD_BUILDER_CONFIG, useValue: read_config_extension_1.ReadConfigExtension },
]);
(0, exports.registryExtension)([
    check_visibility_extension_1.CheckVisibilityExtension,
    grid_extension_1.GridExtension,
    instance_extension_1.InstanceExtension,
    view_model_extension_1.ViewModelExtension,
    form_extension_1.FormExtension,
    datasource_extension_1.DataSourceExtension,
    metadata_extension_1.MetadataExtension,
    actions_extension_1.ActionExtension,
    life_cycle_extension_1.LifeCycleExtension
]);
tslib_1.__exportStar(require("./action"), exports);
tslib_1.__exportStar(require("./action/create-actions"), exports);
tslib_1.__exportStar(require("./basic/basic.extension"), exports);
tslib_1.__exportStar(require("./constant/calculator.constant"), exports);
tslib_1.__exportStar(require("./form/type-api"), exports);
var grid_1 = require("./grid/grid");
Object.defineProperty(exports, "Grid", { enumerable: true, get: function () { return grid_1.Grid; } });
var builder_extension_model_1 = require("./model/builder-extension-model");
Object.defineProperty(exports, "BuilderModel", { enumerable: true, get: function () { return builder_extension_model_1.BuilderModelExtensions; } });
tslib_1.__exportStar(require("./type-api"), exports);
tslib_1.__exportStar(require("./view-model/base.view"), exports);

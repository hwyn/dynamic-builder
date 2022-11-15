"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuilderContext = exports.BuilderContext = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var builder_context_1 = require("../../builder/builder-context");
// eslint-disable-next-line max-len
var token_1 = require("../../token");
var actions_1 = require("../action/actions");
var actions_extension_1 = require("../action/actions.extension");
var datasource_extension_1 = require("../datasource/datasource.extension");
var form_extension_1 = require("../form/form.extension");
var grid_extension_1 = require("../grid/grid.extension");
var instance_extension_1 = require("../instance/instance.extension");
var life_cycle_extension_1 = require("../life-cycle/life-cycle.extension");
var metadata_extension_1 = require("../metadata/metadata.extension");
var read_config_extension_1 = require("../read-config/read-config.extension");
var view_model_extension_1 = require("../view-model/view-model.extension");
var check_visibility_extension_1 = require("../visibility/check-visibility.extension");
var defaultExtensions = [
    check_visibility_extension_1.CheckVisibilityExtension,
    grid_extension_1.GridExtension,
    instance_extension_1.InstanceExtension,
    view_model_extension_1.ViewModelExtension,
    form_extension_1.FormExtension,
    datasource_extension_1.DataSourceExtension,
    metadata_extension_1.MetadataExtension,
    actions_extension_1.ActionExtension,
    life_cycle_extension_1.LifeCycleExtension
];
var BuilderContext = /** @class */ (function (_super) {
    tslib_1.__extends(BuilderContext, _super);
    function BuilderContext() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.map = new Map();
        _this.extensions = defaultExtensions;
        return _this;
    }
    BuilderContext.prototype.useFactory = function (useFactory) {
        return function (injector) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return useFactory.apply(void 0, tslib_1.__spreadArray(tslib_1.__spreadArray([], args, false), [injector], false));
        }; };
    };
    BuilderContext.prototype.registryFactory = function (injector, token) {
        var proxyFactory = this.map.get(token);
        if (proxyFactory) {
            injector.set(token, { provide: token, useFactory: this.useFactory(proxyFactory), deps: [di_1.Injector] });
        }
    };
    BuilderContext.prototype.forwardGetJsonConfig = function (getJsonConfig) {
        this.map.set(token_1.GET_JSON_CONFIG, getJsonConfig);
    };
    BuilderContext.prototype.forwardFormControl = function (factoryFormControl) {
        var proxyFactory = function (value, options, injector) {
            var _a;
            return factoryFormControl(value, (_a = injector.get(token_1.VALIDATOR_SERVICE)) === null || _a === void 0 ? void 0 : _a.getValidators(options), injector);
        };
        this.map.set(token_1.FORM_CONTROL, proxyFactory);
    };
    BuilderContext.prototype.forwardBuilderLayout = function (createElement) {
        this.map.set(token_1.LAYOUT_ELEMENT, createElement);
    };
    BuilderContext.prototype.registryExtension = function (extensions) {
        var _a;
        this.extensions = (_a = this.extensions).concat.apply(_a, extensions);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        _super.prototype.registryInjector.call(this, injector);
        this.registryFactory(injector, token_1.GET_JSON_CONFIG);
        this.registryFactory(injector, token_1.FORM_CONTROL);
        this.registryFactory(injector, token_1.LAYOUT_ELEMENT);
        injector.set(token_1.ACTION_INTERCEPT, { provide: token_1.ACTION_INTERCEPT, useClass: actions_1.Action });
        injector.set(token_1.LOAD_BUILDER_CONFIG, { provide: token_1.LOAD_BUILDER_CONFIG, useValue: read_config_extension_1.ReadConfigExtension });
        this.extensions.forEach(function (extension) {
            injector.set(token_1.BUILDER_EXTENSION, { provide: token_1.BUILDER_EXTENSION, multi: true, useValue: extension });
        });
    };
    return BuilderContext;
}(builder_context_1.BuilderContext));
exports.BuilderContext = BuilderContext;
var useBuilderContext = function () { return new BuilderContext(); };
exports.useBuilderContext = useBuilderContext;

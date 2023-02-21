"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuilderContext = exports.BuilderContext = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var builder_context_1 = require("../../builder/builder-context");
var token_1 = require("../../token");
var actions_1 = require("../action/actions");
var actions_extension_1 = require("../action/actions.extension");
var datasource_extension_1 = require("../datasource/datasource.extension");
var covert_1 = require("../form/covert");
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
    metadata_extension_1.MetadataExtension,
    grid_extension_1.GridExtension,
    datasource_extension_1.DataSourceExtension,
    instance_extension_1.InstanceExtension,
    form_extension_1.FormExtension,
    view_model_extension_1.ViewModelExtension,
    actions_extension_1.ActionExtension,
    life_cycle_extension_1.LifeCycleExtension
];
var BuilderContext = /** @class */ (function (_super) {
    tslib_1.__extends(BuilderContext, _super);
    function BuilderContext(parent) {
        var _this = _super.call(this) || this;
        _this.map = new Map();
        _this.extensions = [];
        _this.actions = [];
        _this.coverts = [];
        parent && _this.extendsConfig(parent);
        return _this;
    }
    BuilderContext.prototype.extendsConfig = function (parent) {
        var _a, _b, _c;
        this.registryExtension(parent.extensions);
        (_a = this.uiElements).push.apply(_a, parent.uiElements);
        (_b = this.actions).push.apply(_b, parent.actions);
        (_c = this.coverts).push.apply(_c, parent.coverts);
    };
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
    BuilderContext.prototype.forwardAction = function (name, action) {
        if (this.actions.some(function (_a) {
            var actionName = _a.name;
            return actionName === name;
        })) {
            console.info("action: ".concat(name, "\u5DF2\u7ECF\u6CE8\u518C\u8FC7!!!!"));
        }
        this.actions.push({ name: name, action: action });
    };
    BuilderContext.prototype.forwardCovert = function (name, covert) {
        if (this.actions.some(function (_a) {
            var covertName = _a.name;
            return covertName === name;
        })) {
            console.info("covert: ".concat(name, "\u5DF2\u7ECF\u6CE8\u518C\u8FC7!!!!"));
        }
        this.coverts.push({ name: name, covert: covert });
    };
    BuilderContext.prototype.registryExtension = function (extensions) {
        var _a;
        (_a = this.extensions).push.apply(_a, extensions);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        _super.prototype.registryInjector.call(this, injector);
        this.registryFactory(injector, token_1.GET_JSON_CONFIG);
        this.registryFactory(injector, token_1.FORM_CONTROL);
        this.registryFactory(injector, token_1.LAYOUT_ELEMENT);
        injector.set(token_1.ACTION_INTERCEPT, { provide: token_1.ACTION_INTERCEPT, useClass: actions_1.Action });
        injector.set(token_1.COVERT_INTERCEPT, { provide: token_1.COVERT_INTERCEPT, useClass: covert_1.Covert });
        injector.set(token_1.ACTIONS_CONFIG, { provide: token_1.ACTIONS_CONFIG, multi: true, useValue: this.actions });
        injector.set(token_1.COVERT_CONFIG, { provide: token_1.COVERT_CONFIG, multi: true, useValue: this.coverts });
        injector.set(token_1.LOAD_BUILDER_CONFIG, { provide: token_1.LOAD_BUILDER_CONFIG, useValue: read_config_extension_1.ReadConfigExtension });
        injector.set(token_1.BUILDER_EXTENSION, { provide: token_1.BUILDER_EXTENSION, multi: true, useValue: defaultExtensions });
        injector.set(token_1.BUILDER_EXTENSION, { provide: token_1.BUILDER_EXTENSION, multi: true, useValue: this.extensions });
    };
    return BuilderContext;
}(builder_context_1.BuilderContext));
exports.BuilderContext = BuilderContext;
var useBuilderContext = function (parent) { return new BuilderContext(parent); };
exports.useBuilderContext = useBuilderContext;

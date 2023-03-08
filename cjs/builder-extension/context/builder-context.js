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
        _this.parent = parent;
        _this.extensions = [];
        _this.map = new Map();
        _this.typeMap = new Map();
        _this.clsMap = new Map();
        return _this;
    }
    BuilderContext.prototype.canExtends = function (injector) {
        var _this = this;
        _super.prototype.registryInjector.call(this, injector);
        this.map.forEach(function (_factory, token) { return _this.registryFactory(injector, token); });
        this.clsMap.forEach(function (cls, token) { return injector.set(token, { provide: token, useClass: cls }); });
        this.typeMap.forEach(function (list, token) { return injector.set(token, { provide: token, multi: true, useValue: list }); });
        injector.set(token_1.BUILDER_EXTENSION, { provide: token_1.BUILDER_EXTENSION, multi: true, useValue: this.extensions });
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
    BuilderContext.prototype.getType = function (token, name) {
        var _a;
        var list = this.typeMap.get(token) || [];
        for (var i = 0, item = list[i]; i < list.length; i++) {
            if (item.name === name)
                return item[item.attr];
        }
        return ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.getType(token, name)) || null;
    };
    BuilderContext.prototype.getFactory = function (token) {
        return this.map.get(token);
    };
    BuilderContext.prototype.forwardClass = function (token, cls) {
        this.clsMap.set(token, cls);
    };
    BuilderContext.prototype.forwardFactory = function (token, factory) {
        this.map.set(token, factory);
    };
    BuilderContext.prototype.forwardType = function (token, name, target, typeName) {
        var _a;
        if (typeName === void 0) { typeName = 'target'; }
        var list = this.typeMap.get(token);
        if (!list)
            this.typeMap.set(token, list = []);
        if (name && target) {
            if (list.some(function (_a) {
                var typeName = _a.name;
                return typeName === name;
            })) {
                console.info("".concat(typeName, ": ").concat(name, "\u5DF2\u7ECF\u6CE8\u518C"));
            }
            target["".concat(typeName, "Name")] = name;
            list.push((_a = { name: name, attr: typeName }, _a[typeName] = target, _a));
        }
    };
    BuilderContext.prototype.forwardGetJsonConfig = function (getJsonConfig) {
        this.map.set(token_1.GET_JSON_CONFIG, getJsonConfig);
    };
    BuilderContext.prototype.forwardFormControl = function (factoryFormControl) {
        this.map.set(token_1.FORM_CONTROL, factoryFormControl);
    };
    BuilderContext.prototype.forwardBuilderLayout = function (createElement) {
        this.map.set(token_1.LAYOUT_ELEMENT, createElement);
    };
    BuilderContext.prototype.forwardAction = function (name, action, options) {
        Object.assign(action, options);
        this.forwardType(token_1.ACTIONS_CONFIG, name, action, 'action');
    };
    BuilderContext.prototype.forwardCovert = function (name, covert) {
        this.forwardType(token_1.COVERT_CONFIG, name, covert, 'covert');
    };
    BuilderContext.prototype.registryExtension = function (extensions) {
        var _a;
        (_a = this.extensions).push.apply(_a, extensions);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        var _a;
        injector.set(token_1.LOAD_BUILDER_CONFIG, { provide: token_1.LOAD_BUILDER_CONFIG, useValue: read_config_extension_1.ReadConfigExtension });
        injector.set(token_1.BUILDER_EXTENSION, { provide: token_1.BUILDER_EXTENSION, multi: true, useValue: defaultExtensions });
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.canExtends(injector);
        injector.set(BuilderContext, { provide: BuilderContext, useValue: this });
        injector.set(token_1.GET_TYPE, { provide: token_1.GET_TYPE, useValue: this.getType.bind(this) });
        injector.set(token_1.ACTION_INTERCEPT, { provide: token_1.ACTION_INTERCEPT, useClass: actions_1.Action });
        injector.set(token_1.COVERT_INTERCEPT, { provide: token_1.COVERT_INTERCEPT, useClass: covert_1.Covert });
        this.canExtends(injector);
    };
    return BuilderContext;
}(builder_context_1.BuilderContext));
exports.BuilderContext = BuilderContext;
var useBuilderContext = function (parent) { return new BuilderContext(parent); };
exports.useBuilderContext = useBuilderContext;

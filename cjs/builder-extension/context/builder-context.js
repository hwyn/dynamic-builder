"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuilderContext = exports.BuilderContext = exports.BaseType = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@hwy-fm/di");
var builder_context_1 = require("../../builder/builder-context");
var token_1 = require("../../token");
var action_1 = require("../action");
var actions_1 = require("../action/actions");
var actions_extension_1 = require("../action/actions.extension");
var datasource_extension_1 = require("../datasource/datasource.extension");
var convert_1 = require("../form/convert");
var form_extension_1 = require("../form/form.extension");
var grid_1 = require("../grid/grid");
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
var base_type_1 = require("./base-type");
Object.defineProperty(exports, "BaseType", { enumerable: true, get: function () { return base_type_1.BaseType; } });
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
        var _a;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.canExtends(injector);
        _super.prototype.registryInjector.call(this, injector);
        this.map.forEach(function (_factory, token) { return _this.registryFactory(injector, token); });
        this.clsMap.forEach(function (cls, token) { return injector.set(token, { provide: token, useClass: cls }); });
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
        for (var i = 0, item = void 0; i < list.length; i++) {
            item = list[i];
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
            }))
                console.info("".concat(typeName, ": ").concat(name, "\u5DF2\u7ECF\u6CE8\u518C"));
            if (!(0, di_1.getInjectableDef)(target))
                (0, di_1.setInjectableDef)(target, { providedIn: 'any', nonSingle: true });
            target["".concat(typeName, "Name")] = name;
            list.push((_a = { name: name, attr: typeName }, _a[typeName] = target, _a));
        }
    };
    BuilderContext.prototype.forwardGetJsonConfig = function (getJsonConfig) {
        this.forwardFactory(token_1.GET_JSON_CONFIG, getJsonConfig);
    };
    BuilderContext.prototype.forwardFormControl = function (factoryFormControl) {
        this.forwardFactory(token_1.FORM_CONTROL, factoryFormControl);
    };
    BuilderContext.prototype.forwardBuilderLayout = function (createElement) {
        this.forwardFactory(token_1.LAYOUT_ELEMENT, createElement);
    };
    BuilderContext.prototype.forwardAction = function (name, action, options) {
        Object.assign(action, options);
        this.forwardType(token_1.ACTIONS_CONFIG, name, action, 'action');
    };
    BuilderContext.prototype.forwardConvert = function (name, convert) {
        this.forwardType(token_1.CONVERT_CONFIG, name, convert, 'convert');
    };
    BuilderContext.prototype.registryExtension = function (extensions) {
        var _a;
        (_a = this.extensions).push.apply(_a, extensions);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        (0, di_1.deepProviders)(injector, [
            { provide: BuilderContext, useValue: this },
            { provide: token_1.ACTION_INTERCEPT, useClass: actions_1.Action },
            { provide: token_1.CONVERT_INTERCEPT, useClass: convert_1.Convert },
            { provide: token_1.GET_TYPE, useValue: this.getType.bind(this) },
            { provide: token_1.GRID_PARSE, useFactory: this.useFactory(grid_1.Grid.create) },
            { provide: token_1.EVENT_HOOK, useFactory: this.useFactory(action_1.EventHook.create) },
            { provide: token_1.LOAD_BUILDER_CONFIG, useValue: read_config_extension_1.ReadConfigExtension },
            { provide: token_1.BUILDER_EXTENSION, multi: true, useValue: defaultExtensions }
        ]);
        this.canExtends(injector);
    };
    return BuilderContext;
}(builder_context_1.BuilderContext));
exports.BuilderContext = BuilderContext;
var useBuilderContext = function (parent) { return new BuilderContext(parent); };
exports.useBuilderContext = useBuilderContext;

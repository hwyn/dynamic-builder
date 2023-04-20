import { __extends, __spreadArray } from "tslib";
import { getInjectableDef, Injector, setInjectableDef } from '@fm/di';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
import { ACTION_INTERCEPT, ACTIONS_CONFIG, BUILDER_EXTENSION, CONVERT_CONFIG, CONVERT_INTERCEPT, FORM_CONTROL, GET_JSON_CONFIG, GET_TYPE, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG } from '../../token';
import { Action } from '../action/actions';
import { ActionExtension } from '../action/actions.extension';
import { DataSourceExtension } from '../datasource/datasource.extension';
import { Convert } from '../form/convert';
import { FormExtension } from '../form/form.extension';
import { GridExtension } from '../grid/grid.extension';
import { InstanceExtension } from '../instance/instance.extension';
import { LifeCycleExtension } from '../life-cycle/life-cycle.extension';
import { MetadataExtension } from '../metadata/metadata.extension';
import { ReadConfigExtension } from '../read-config/read-config.extension';
import { ViewModelExtension } from '../view-model/view-model.extension';
import { CheckVisibilityExtension } from '../visibility/check-visibility.extension';
var defaultExtensions = [
    CheckVisibilityExtension,
    MetadataExtension,
    GridExtension,
    DataSourceExtension,
    InstanceExtension,
    FormExtension,
    ViewModelExtension,
    ActionExtension,
    LifeCycleExtension
];
export { BaseType } from './base-type';
var BuilderContext = /** @class */ (function (_super) {
    __extends(BuilderContext, _super);
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
        injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: this.extensions });
    };
    BuilderContext.prototype.useFactory = function (useFactory) {
        return function (injector) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return useFactory.apply(void 0, __spreadArray(__spreadArray([], args, false), [injector], false));
        }; };
    };
    BuilderContext.prototype.registryFactory = function (injector, token) {
        var proxyFactory = this.map.get(token);
        if (proxyFactory) {
            injector.set(token, { provide: token, useFactory: this.useFactory(proxyFactory), deps: [Injector] });
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
            if (!getInjectableDef(target))
                setInjectableDef(target, { providedIn: 'any' });
            target["".concat(typeName, "Name")] = name;
            list.push((_a = { name: name, attr: typeName }, _a[typeName] = target, _a));
        }
    };
    BuilderContext.prototype.forwardGetJsonConfig = function (getJsonConfig) {
        this.forwardFactory(GET_JSON_CONFIG, getJsonConfig);
    };
    BuilderContext.prototype.forwardFormControl = function (factoryFormControl) {
        this.forwardFactory(FORM_CONTROL, factoryFormControl);
    };
    BuilderContext.prototype.forwardBuilderLayout = function (createElement) {
        this.forwardFactory(LAYOUT_ELEMENT, createElement);
    };
    BuilderContext.prototype.forwardAction = function (name, action, options) {
        Object.assign(action, options);
        this.forwardType(ACTIONS_CONFIG, name, action, 'action');
    };
    BuilderContext.prototype.forwardConvert = function (name, convert) {
        this.forwardType(CONVERT_CONFIG, name, convert, 'convert');
    };
    BuilderContext.prototype.registryExtension = function (extensions) {
        var _a;
        (_a = this.extensions).push.apply(_a, extensions);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        var _a;
        injector.set(LOAD_BUILDER_CONFIG, { provide: LOAD_BUILDER_CONFIG, useValue: ReadConfigExtension });
        injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: defaultExtensions });
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.canExtends(injector);
        injector.set(BuilderContext, { provide: BuilderContext, useValue: this });
        injector.set(GET_TYPE, { provide: GET_TYPE, useValue: this.getType.bind(this) });
        injector.set(ACTION_INTERCEPT, { provide: ACTION_INTERCEPT, useClass: Action });
        injector.set(CONVERT_INTERCEPT, { provide: CONVERT_INTERCEPT, useClass: Convert });
        this.canExtends(injector);
    };
    return BuilderContext;
}(BasicBuilderContext));
export { BuilderContext };
export var useBuilderContext = function (parent) { return new BuilderContext(parent); };

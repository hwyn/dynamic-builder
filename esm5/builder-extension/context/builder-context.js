import { __extends, __spreadArray } from "tslib";
import { Injector } from '@fm/di';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
import { ACTION_INTERCEPT, ACTIONS_CONFIG, BUILDER_EXTENSION, COVERT_CONFIG, COVERT_INTERCEPT, FORM_CONTROL, GET_JSON_CONFIG, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG, VALIDATOR_SERVICE } from '../../token';
import { Action } from '../action/actions';
import { ActionExtension } from '../action/actions.extension';
import { DataSourceExtension } from '../datasource/datasource.extension';
import { Covert } from '../form/covert';
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
var BuilderContext = /** @class */ (function (_super) {
    __extends(BuilderContext, _super);
    function BuilderContext(parent) {
        var _this = _super.call(this) || this;
        _this.map = new Map();
        _this.actions = [];
        _this.coverts = [];
        _this.extensions = [];
        parent && parent.extendsConfig(_this);
        return _this;
    }
    BuilderContext.prototype.extendsConfig = function (childContext) {
        var _a, _b, _c;
        childContext.registryExtension(this.extensions);
        (_a = childContext.uiElements).push.apply(_a, this.uiElements);
        (_b = childContext.actions).push.apply(_b, this.actions);
        (_c = childContext.coverts).push.apply(_c, this.coverts);
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
    BuilderContext.prototype.forwardGetJsonConfig = function (getJsonConfig) {
        this.map.set(GET_JSON_CONFIG, getJsonConfig);
    };
    BuilderContext.prototype.forwardFormControl = function (factoryFormControl) {
        var proxyFactory = function (value, options, injector) {
            var _a;
            return factoryFormControl(value, (_a = injector.get(VALIDATOR_SERVICE)) === null || _a === void 0 ? void 0 : _a.getValidators(options), injector);
        };
        this.map.set(FORM_CONTROL, proxyFactory);
    };
    BuilderContext.prototype.forwardBuilderLayout = function (createElement) {
        this.map.set(LAYOUT_ELEMENT, createElement);
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
        this.registryFactory(injector, GET_JSON_CONFIG);
        this.registryFactory(injector, FORM_CONTROL);
        this.registryFactory(injector, LAYOUT_ELEMENT);
        injector.set(ACTION_INTERCEPT, { provide: ACTION_INTERCEPT, useClass: Action });
        injector.set(COVERT_INTERCEPT, { provide: COVERT_INTERCEPT, useClass: Covert });
        injector.set(ACTIONS_CONFIG, { provide: ACTIONS_CONFIG, multi: true, useValue: this.actions });
        injector.set(COVERT_CONFIG, { provide: COVERT_CONFIG, multi: true, useValue: this.coverts });
        injector.set(LOAD_BUILDER_CONFIG, { provide: LOAD_BUILDER_CONFIG, useValue: ReadConfigExtension });
        injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: defaultExtensions });
        injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: this.extensions });
    };
    return BuilderContext;
}(BasicBuilderContext));
export { BuilderContext };
export var useBuilderContext = function (parent) { return new BuilderContext(parent); };

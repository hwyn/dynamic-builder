import { __extends, __spreadArray } from "tslib";
import { Injector } from '@fm/di';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
// eslint-disable-next-line max-len
import { ACTION_INTERCEPT, BUILDER_EXTENSION, FORM_CONTROL, GET_JSON_CONFIG, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG, VALIDATOR_SERVICE } from '../../token';
import { Action } from '../action/actions';
import { ActionExtension } from '../action/actions.extension';
import { DataSourceExtension } from '../datasource/datasource.extension';
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
    GridExtension,
    InstanceExtension,
    ViewModelExtension,
    FormExtension,
    DataSourceExtension,
    MetadataExtension,
    ActionExtension,
    LifeCycleExtension
];
var BuilderContext = /** @class */ (function (_super) {
    __extends(BuilderContext, _super);
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
    BuilderContext.prototype.registryExtension = function (extensions) {
        var _a;
        this.extensions = (_a = this.extensions).concat.apply(_a, extensions);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        _super.prototype.registryInjector.call(this, injector);
        this.registryFactory(injector, GET_JSON_CONFIG);
        this.registryFactory(injector, FORM_CONTROL);
        this.registryFactory(injector, LAYOUT_ELEMENT);
        injector.set(ACTION_INTERCEPT, { provide: ACTION_INTERCEPT, useClass: Action });
        injector.set(LOAD_BUILDER_CONFIG, { provide: LOAD_BUILDER_CONFIG, useValue: ReadConfigExtension });
        this.extensions.forEach(function (extension) {
            injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: extension });
        });
    };
    return BuilderContext;
}(BasicBuilderContext));
export { BuilderContext };
export var useBuilderContext = function () { return new BuilderContext(); };

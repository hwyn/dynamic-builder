"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderContext = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var token_1 = require("../token");
var builder_engine_service_1 = require("./builder-engine.service");
var builder_model_1 = require("./builder-model");
var builder_scope_1 = require("./builder-scope");
var decorator_1 = require("./decorator");
var _contextProvs = [
    builder_scope_1.BuilderScope,
    { provide: token_1.SCOPE_MODEL, useExisting: builder_scope_1.BuilderScope },
    { provide: token_1.META_PROPS, deps: [builder_scope_1.BuilderScope], useFactory: function (builder) { return builder.resetMetaTypeProps(); } }
];
var BuilderContext = /** @class */ (function () {
    function BuilderContext() {
        this.uiElements = [];
    }
    BuilderContext.prototype.forwardUiElement = function (name, Element) {
        this.uiElements.push({ name: name, component: Element });
        return Element;
    };
    BuilderContext.prototype.factoryBuilder = function (injector) {
        return function (_a) {
            var _b;
            var _c = _a.BuilderModel, NB = _c === void 0 ? builder_model_1.BuilderModel : _c, _d = _a.providers, providers = _d === void 0 ? [] : _d, context = _a.context, props = tslib_1.__rest(_a, ["BuilderModel", "providers", "context"]);
            var model;
            var _injector = ((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector;
            if (NB[decorator_1.BUILDER_DEF] && !(Object.create(NB.prototype) instanceof builder_model_1.BuilderModel)) {
                var _providers = [{ provide: token_1.META_TYPE, useExisting: NB }, _contextProvs, NB, providers];
                _injector = di_1.Injector.create([], _injector);
                context === null || context === void 0 ? void 0 : context.registryInjector(_injector);
                (0, di_1.deepProviders)(_injector, [{ provide: token_1.SCOPE_PROPS, useValue: { props: props } }, _providers]);
                model = _injector.get(builder_scope_1.BuilderScope);
            }
            return (model || _injector.get(NB, di_1.InjectFlags.NonCache)).loadForBuild(props);
        };
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        (0, di_1.deepProviders)(injector, [
            { provide: token_1.UI_ELEMENT, multi: true, useValue: this.uiElements },
            { provide: builder_engine_service_1.BuilderEngine, useClass: builder_engine_service_1.BuilderEngine, deps: [token_1.UI_ELEMENT] },
            { provide: token_1.FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [di_1.Injector] }
        ]);
    };
    return BuilderContext;
}());
exports.BuilderContext = BuilderContext;

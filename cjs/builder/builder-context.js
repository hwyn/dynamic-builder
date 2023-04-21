"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderContext = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var token_1 = require("../token");
var builder_engine_service_1 = require("./builder-engine.service");
var builder_model_1 = require("./builder-model");
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
            var _c = _a.BuilderModel, NB = _c === void 0 ? builder_model_1.BuilderModel : _c, props = tslib_1.__rest(_a, ["BuilderModel"]);
            if (!(0, di_1.getInjectableDef)(NB))
                (0, di_1.setInjectableDef)(NB, { providedIn: 'any', nonSingle: true });
            return (((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector).get(NB, di_1.InjectFlags.NonCache).loadForBuild(props);
        };
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        injector.set(token_1.UI_ELEMENT, { provide: token_1.UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(builder_engine_service_1.BuilderEngine, { provide: builder_engine_service_1.BuilderEngine, useClass: builder_engine_service_1.BuilderEngine, deps: [token_1.UI_ELEMENT] });
        injector.set(token_1.FACTORY_BUILDER, { provide: token_1.FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [di_1.Injector] });
    };
    return BuilderContext;
}());
exports.BuilderContext = BuilderContext;

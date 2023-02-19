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
<<<<<<< HEAD
            var _b;
            var _c = _a.BuilderModel, NB = _c === void 0 ? builder_model_1.BuilderModel : _c, props = tslib_1.__rest(_a, ["BuilderModel"]);
            return new NB(((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector, props).loadForBuild(props);
=======
            var _b = _a.BuilderModel, NB = _b === void 0 ? builder_model_1.BuilderModel : _b, props = tslib_1.__rest(_a, ["BuilderModel"]);
            return new NB(injector).loadForBuild(props);
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        };
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        injector.set(token_1.UI_ELEMENT, { provide: token_1.UI_ELEMENT, multi: true, useValue: this.uiElements });
<<<<<<< HEAD
        injector.set(builder_engine_service_1.BuilderEngine, { provide: builder_engine_service_1.BuilderEngine, useClass: builder_engine_service_1.BuilderEngine, deps: [token_1.UI_ELEMENT] });
=======
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        injector.set(token_1.FACTORY_BUILDER, { provide: token_1.FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [di_1.Injector] });
    };
    return BuilderContext;
}());
exports.BuilderContext = BuilderContext;

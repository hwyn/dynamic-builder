"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderContext = void 0;
var di_1 = require("@fm/di");
var token_1 = require("../token");
var builder_engine_service_1 = require("./builder-engine.service");
var builder_utils_1 = require("./builder-utils");
var BuilderContext = /** @class */ (function () {
    function BuilderContext() {
        this.uiElements = [];
    }
    BuilderContext.prototype.forwardUiElement = function (name, Element) {
        this.uiElements.push({ name: name, component: Element });
        return Element;
    };
    BuilderContext.prototype.factoryBuilder = function (builderUtils) {
        return function (props) { return builderUtils.builder(props); };
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        (0, di_1.deepProviders)(injector, [
            builder_utils_1.BuilderUtils,
            { provide: token_1.UI_ELEMENT, multi: true, useValue: this.uiElements },
            { provide: builder_engine_service_1.BuilderEngine, useClass: builder_engine_service_1.BuilderEngine, deps: [token_1.UI_ELEMENT] },
            { provide: token_1.FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [builder_utils_1.BuilderUtils] }
        ]);
    };
    return BuilderContext;
}());
exports.BuilderContext = BuilderContext;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderContext = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var token_1 = require("../token");
var builder_model_1 = require("./builder-model");
var BuilderContext = /** @class */ (function () {
    function BuilderContext() {
        this.uiElements = [];
    }
    BuilderContext.prototype.forwardUiElement = function (name, Element) {
        this.uiElements.push({ name: name, component: Element });
        return Element;
    };
    BuilderContext.prototype.factoryBuilder = function (injector, _a) {
        var _b = _a.BuilderModel, NewBuilderModel = _b === void 0 ? builder_model_1.BuilderModel : _b, props = tslib_1.__rest(_a, ["BuilderModel"]);
        return new NewBuilderModel(injector).loadForBuild(props);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        injector.set(token_1.UI_ELEMENT, { provide: token_1.UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(token_1.FACTORY_BUILDER, { provide: token_1.FACTORY_BUILDER, useFactory: this.factoryBuilder.bind(this), deps: [di_1.Injector] });
    };
    return BuilderContext;
}());
exports.BuilderContext = BuilderContext;

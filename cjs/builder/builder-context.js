"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderContext = void 0;
const di_1 = require("@fm/di");
const token_1 = require("../token");
const builder_model_1 = require("./builder-model");
class BuilderContext {
    uiElements = [];
    forwardUiElement(name, Element) {
        this.uiElements.push({ name, component: Element });
        return Element;
    }
    factoryBuilder(injector, { BuilderModel: NewBuilderModel = builder_model_1.BuilderModel, ...props }) {
        return new NewBuilderModel(injector).loadForBuild(props);
    }
    registryInjector(injector) {
        injector.set(token_1.UI_ELEMENT, { provide: token_1.UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(token_1.FACTORY_BUILDER, { provide: token_1.FACTORY_BUILDER, useFactory: this.factoryBuilder.bind(this), deps: [di_1.Injector] });
    }
}
exports.BuilderContext = BuilderContext;

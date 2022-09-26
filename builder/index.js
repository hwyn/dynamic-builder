"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardUiElement = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const token_1 = require("../token");
const builder_model_1 = require("./builder-model");
const factoryBuilder = (injector, { BuilderModel: NewBuilderModel = builder_model_1.BuilderModel, ...props }) => {
    return new NewBuilderModel(injector).loadForBuild(props);
};
const forwardUiElement = (name, Element) => {
    (0, di_1.registryProvider)({ provide: token_1.UI_ELEMENT, multi: true, useValue: { name, component: Element } });
    return Element;
};
exports.forwardUiElement = forwardUiElement;
(0, di_1.registryProvider)({ provide: token_1.FACTORY_BUILDER, useFactory: factoryBuilder, deps: [di_1.Injector] });
tslib_1.__exportStar(require("./consts"), exports);
tslib_1.__exportStar(require("./type-api"), exports);

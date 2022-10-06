import { __rest } from "tslib";
import { Injector } from '@fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderModel } from './builder-model';
var BuilderContext = /** @class */ (function () {
    function BuilderContext() {
        this.uiElements = [];
    }
    BuilderContext.prototype.forwardUiElement = function (name, Element) {
        this.uiElements.push({ name: name, component: Element });
        return Element;
    };
    BuilderContext.prototype.factoryBuilder = function (injector, _a) {
        var _b = _a.BuilderModel, NewBuilderModel = _b === void 0 ? BuilderModel : _b, props = __rest(_a, ["BuilderModel"]);
        return new NewBuilderModel(injector).loadForBuild(props);
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        injector.set(UI_ELEMENT, { provide: UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(FACTORY_BUILDER, { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder.bind(this), deps: [Injector] });
    };
    return BuilderContext;
}());
export { BuilderContext };

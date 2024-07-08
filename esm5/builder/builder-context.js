import { deepProviders } from '@hwy-fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderEngine } from './builder-engine.service';
import { BuilderUtils } from './builder-utils';
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
        deepProviders(injector, [
            BuilderUtils,
            { provide: UI_ELEMENT, multi: true, useValue: this.uiElements },
            { provide: BuilderEngine, useClass: BuilderEngine, deps: [UI_ELEMENT] },
            { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [BuilderUtils] }
        ]);
    };
    return BuilderContext;
}());
export { BuilderContext };

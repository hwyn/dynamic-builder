import { deepProviders } from '@hwy-fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderEngine } from './builder-engine.service';
import { BuilderUtils } from './builder-utils';
export class BuilderContext {
    constructor() {
        this.uiElements = [];
    }
    forwardUiElement(name, Element) {
        this.uiElements.push({ name, component: Element });
        return Element;
    }
    factoryBuilder(builderUtils) {
        return (props) => builderUtils.builder(props);
    }
    registryInjector(injector) {
        deepProviders(injector, [
            BuilderUtils,
            { provide: UI_ELEMENT, multi: true, useValue: this.uiElements },
            { provide: BuilderEngine, useClass: BuilderEngine, deps: [UI_ELEMENT] },
            { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [BuilderUtils] }
        ]);
    }
}

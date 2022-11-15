import { __rest } from "tslib";
import { Injector } from '@fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderModel } from './builder-model';
export class BuilderContext {
    constructor() {
        this.uiElements = [];
    }
    forwardUiElement(name, Element) {
        this.uiElements.push({ name, component: Element });
        return Element;
    }
    factoryBuilder(injector) {
        return (_a) => {
            var { BuilderModel: NB = BuilderModel } = _a, props = __rest(_a, ["BuilderModel"]);
            return new NB(injector).loadForBuild(props);
        };
    }
    registryInjector(injector) {
        injector.set(UI_ELEMENT, { provide: UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(FACTORY_BUILDER, { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [Injector] });
    }
}

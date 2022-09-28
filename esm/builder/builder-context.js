import { Injector } from '@fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderModel } from './builder-model';
export class BuilderContext {
    uiElements = [];
    forwardUiElement(name, Element) {
        this.uiElements.push({ name, component: Element });
        return Element;
    }
    factoryBuilder(injector, { BuilderModel: NewBuilderModel = BuilderModel, ...props }) {
        return new NewBuilderModel(injector).loadForBuild(props);
    }
    registryInjector(injector) {
        injector.set(UI_ELEMENT, { provide: UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(FACTORY_BUILDER, { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder.bind(this), deps: [Injector] });
    }
}

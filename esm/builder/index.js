import { Injector, registryProvider } from '@fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderModel } from './builder-model';
const factoryBuilder = (injector, { BuilderModel: NewBuilderModel = BuilderModel, ...props }) => {
    return new NewBuilderModel(injector).loadForBuild(props);
};
export const forwardUiElement = (name, Element) => {
    registryProvider({ provide: UI_ELEMENT, multi: true, useValue: { name, component: Element } });
    return Element;
};
registryProvider({ provide: FACTORY_BUILDER, useFactory: factoryBuilder, deps: [Injector] });
export * from './consts';
export * from './type-api';

import { LocatorStorage, registryProvider } from '@fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderModel } from './builder-model';
const factoryBuilder = (ls, { BuilderModel: NewBuilderModel = BuilderModel, ...props }) => {
    return new NewBuilderModel(ls).loadForBuild(props);
};
export const forwardUiElement = (name, Element) => (registryProvider({ provide: UI_ELEMENT, multi: true, useValue: { name, component: Element } }));
registryProvider({ provide: FACTORY_BUILDER, useFactory: factoryBuilder, deps: [LocatorStorage] });
export * from './consts';
export * from './type-api';

import { Injector } from '@hwy-fm/di';
import { BuilderUtils } from './builder-utils';
import { BuilderProps } from './type-api';
export type UiElement = {
    name: string;
    component: any;
};
export declare class BuilderContext {
    protected uiElements: UiElement[];
    forwardUiElement(name: string, Element: any): any;
    factoryBuilder(builderUtils: BuilderUtils): (props: BuilderProps) => import("./type-api").BuilderModelImplements;
    registryInjector(injector: Injector): void;
}

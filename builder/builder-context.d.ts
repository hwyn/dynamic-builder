import { Injector } from '@fm/di';
import { BuilderProps } from './type-api';
export declare type UiElement = {
    name: string;
    component: any;
};
export declare class BuilderContext {
    protected uiElements: UiElement[];
    forwardUiElement(name: string, Element: any): any;
    factoryBuilder(injector: Injector): ({ BuilderModel: NB, ...props }: BuilderProps) => any;
    registryInjector(injector: Injector): void;
}

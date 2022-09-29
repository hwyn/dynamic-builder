import { Injector, Type } from '@fm/di';
import { Observable } from 'rxjs';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
import { BasicExtension } from '../basic/basic.extension';
import { ControlOptions } from '../form/type-api';
import { Grid } from '../grid/grid';
import { BuilderModelExtensions } from '../type-api';
export declare class BuilderContext extends BasicBuilderContext {
    private map;
    private extensions;
    private useFactory;
    private registryFactory;
    forwardGetJsonConfig(getJsonConfig: (configName: string, injector: Injector) => Observable<object>): void;
    forwardFormControl(factoryFormControl: (value: any, options: ControlOptions, injector: Injector) => any): void;
    forwardBuilderLayout(createElement: (grid: Grid, builder: BuilderModelExtensions, injector: Injector) => any): void;
    registryExtension(extensions: Type<BasicExtension>[]): void;
    registryInjector(injector: Injector): void;
}
export declare const useBuilderContext: () => BuilderContext;

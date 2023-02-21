import { Injector, Type } from '@fm/di';
import { Observable } from 'rxjs';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
import { BaseAction } from '../action';
import { BasicExtension } from '../basic/basic.extension';
import { BaseCovert } from '../form/base-covert';
import { ControlOptions } from '../form/type-api';
import { Grid } from '../grid/grid';
import { BuilderModelExtensions } from '../type-api';
export declare class BuilderContext extends BasicBuilderContext {
    private map;
    private extensions;
    private actions;
    private coverts;
    constructor(parent?: BuilderContext);
    private extendsConfig;
    private useFactory;
    private registryFactory;
    forwardGetJsonConfig(getJsonConfig: (configName: string, injector: Injector) => Observable<object>): void;
    forwardFormControl(factoryFormControl: (value: any, options: ControlOptions, injector: Injector) => any): void;
    forwardBuilderLayout(createElement: (grid: Grid, builder: BuilderModelExtensions, injector: Injector) => any): void;
    forwardAction(name: string, action: Type<BaseAction>): void;
    forwardCovert(name: string, covert: Type<BaseCovert>): void;
    registryExtension(extensions: Type<BasicExtension>[]): void;
    registryInjector(injector: Injector): void;
}
export declare const useBuilderContext: (parent?: BuilderContext) => BuilderContext;

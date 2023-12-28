import { Injector } from '@fm/di';
import { BuilderModelImplements, BuilderProps } from './type-api';
export declare class BuilderUtils {
    protected injector: Injector;
    constructor(injector: Injector);
    factory(props: BuilderProps): BuilderModelImplements;
    builder(props: BuilderProps): BuilderModelImplements;
}

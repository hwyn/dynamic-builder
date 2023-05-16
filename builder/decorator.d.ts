import { Type } from '@fm/di';
export declare const BUILDER_DEF = "__builder_def__";
export declare const INPUT_PROPS = "InputProps";
export declare const ROOT_MODEL = "ROOT_MODEL";
export declare const DYNAMIC_BUILDER = "DynamicBuilder";
export declare function makeBuilderDecorator(name: string, forward?: ((type: Type<any>, props: any) => any)): (props?: any) => (cls: Type<any>) => any;
export declare const DynamicModel: (props?: any) => (cls: Type<any>) => any;
export declare const RootModel: (this: unknown, ...args: any[]) => any;
export declare const InputProps: (this: unknown, ...args: any[]) => any;
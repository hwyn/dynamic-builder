import { Type } from '@fm/di';
export declare function makeBuilderDecorator(name: string, forward?: ((type: Type<any>, props: any) => any)): (props?: any) => (cls: Type<any>) => any;
export declare const DynamicModel: (props?: any) => (cls: Type<any>) => any;

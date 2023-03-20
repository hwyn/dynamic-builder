import { BuilderModel } from '../../builder/builder-model';
import { BuilderFieldExtensions } from '../type-api';
export declare interface BaseConvertImpl {
    toModel(value: any): any;
    toView(value: any): any;
}
export declare interface FormControl<T = any> {
    readonly value: T;
    enable(): void;
    disable(): void;
    patchValue(value: T): void;
    updateValueAndValidity(): void;
    destroy(fieldId?: string): void;
}
export declare interface BuilderFormField {
    control?: FormControl;
}
export interface FormOptions {
    builder: BuilderModel;
    builderField: BuilderFieldExtensions;
}

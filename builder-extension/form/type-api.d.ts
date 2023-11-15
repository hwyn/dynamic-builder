import { Observable } from 'rxjs';
import { BuilderFieldExtensions, BuilderModelExtensions } from '../type-api';
export type ValidationErrors = {
    [key: string]: any;
};
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
    clearValidators(): void;
    setValidators(validators: ValidatorFn[]): void;
    setAsyncValidators(asyncValidators: AsyncValidatorFn[]): void;
    destroy(fieldId?: string): void;
}
export declare interface BuilderFormField {
    control?: FormControl;
}
export interface FormOptions {
    builder: BuilderModelExtensions;
    builderField: BuilderFieldExtensions;
}
export declare interface ValidatorFn {
    (control: FormControl): ValidationErrors | null;
}
export declare interface AsyncValidatorFn {
    (control: FormControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}
export declare interface ControlOptions {
    validators?: ValidatorFn[];
    asyncValidators?: AsyncValidatorFn[];
}

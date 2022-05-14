import { Observable, Subject } from 'rxjs';
import { BuilderModel } from '../../builder/builder-model';
import { BuilderFieldExtensions } from '../type-api';
declare type updateOn = 'change' | 'blur' | 'submit';
export declare interface FormControl<T = any> {
    readonly value: T;
    readonly disabled: boolean;
    readonly enabled: boolean;
    readonly changeValues: Subject<any>;
    readonly updateOn: updateOn;
    patchValue(value: T): void;
    updateValueAndValidity(): void;
    destory(fieldId?: string): void;
    disable(): void;
    enable(): void;
}
export declare interface BuilderFormField {
    control?: FormControl;
}
export interface FormOptions {
    builder: BuilderModel;
    builderField: BuilderFieldExtensions;
}
export declare type FormControlStatus = "VALID" | "INVALID" | "PENDING" | "DISABLED";
export declare type ValidationErrors = {
    [key: string]: any;
};
export declare interface ValidatorFn {
    (control: FormControl): FormControl | null;
}
export declare interface AsyncValidatorFn {
    (control: FormControl): Promise<FormControl | null> | Observable<FormControl | null>;
}
export declare interface ControlOptions {
    validators?: ValidatorFn | ValidatorFn[] | null;
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
    updateOn?: updateOn;
}
export declare interface ValidatorService {
    getValidators(options: FormOptions): ControlOptions;
}
export {};

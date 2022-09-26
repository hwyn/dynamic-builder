import { Injectable, Injector, registryProvider } from '@fm/di';
// eslint-disable-next-line max-len
import { ACTION_INTERCEPT, BUILDER_EXTENSION, FORM_CONTROL, GET_JSON_CONFIG, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG, VALIDATOR_SERVICE } from '../token';
import { Action } from './action/actions';
import { ActionExtension } from './action/actions.extension';
import { serializeAction } from './basic/basic.extension';
import { DataSourceExtension } from './datasource/datasource.extension';
import { FormExtension } from './form/form.extension';
import { GridExtension } from './grid/grid.extension';
import { InstanceExtension } from './instance/instance.extension';
import { LifeCycleExtension } from './life-cycle/life-cycle.extension';
import { MetadataExtension } from './metadata/metadata.extension';
import { ReadConfigExtension } from './read-config/read-config.extension';
import { ViewModelExtension } from './view-model/view-model.extension';
import { CheckVisibilityExtension } from './visibility/check-visibility.extension';
const registryFactory = (token, useFactory) => {
    const proxyUseFactory = (injector, ...args) => useFactory(...args, injector);
    registryProvider({ provide: token, useFactory: proxyUseFactory, deps: [Injector] });
};
export const forwardGetJsonConfig = (getJsonConfig) => {
    registryFactory(GET_JSON_CONFIG, getJsonConfig);
};
export const forwardFormControl = (factoryFormControl) => {
    registryFactory(FORM_CONTROL, (value, options, injector) => {
        return factoryFormControl(value, injector.get(VALIDATOR_SERVICE)?.getValidators(options), injector);
    });
};
export const forwardBuilderLayout = (createElement) => {
    registryFactory(LAYOUT_ELEMENT, createElement);
};
export const registryExtension = (extensions) => {
    registryProvider(extensions.map((extension) => ({ provide: BUILDER_EXTENSION, multi: true, useValue: extension })));
};
export const InjectableValidator = () => Injectable(VALIDATOR_SERVICE);
registryProvider([
    { provide: ACTION_INTERCEPT, useClass: Action },
    { provide: LOAD_BUILDER_CONFIG, useValue: ReadConfigExtension },
]);
registryExtension([
    CheckVisibilityExtension,
    GridExtension,
    InstanceExtension,
    ViewModelExtension,
    FormExtension,
    DataSourceExtension,
    MetadataExtension,
    ActionExtension,
    LifeCycleExtension
]);
export * from './action';
export * from './action/create-actions';
export * from './basic/basic.extension';
export * from './constant/calculator.constant';
export * from './form/type-api';
export { Grid } from './grid/grid';
export { BuilderModelExtensions as BuilderModel } from './model/builder-extension-model';
export * from './type-api';
export * from './view-model/base.view';
export { serializeAction };

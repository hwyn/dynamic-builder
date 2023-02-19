import { Injector } from '@fm/di';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
<<<<<<< HEAD
import { ACTION_INTERCEPT, ACTIONS_CONFIG, BUILDER_EXTENSION, COVERT_CONFIG, COVERT_INTERCEPT, FORM_CONTROL, GET_JSON_CONFIG, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG, VALIDATOR_SERVICE } from '../../token';
=======
import { ACTION_INTERCEPT, BUILDER_EXTENSION, FORM_CONTROL, GET_JSON_CONFIG, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG, VALIDATOR_SERVICE } from '../../token';
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
import { Action } from '../action/actions';
import { ActionExtension } from '../action/actions.extension';
import { DataSourceExtension } from '../datasource/datasource.extension';
import { Covert } from '../form/covert';
import { FormExtension } from '../form/form.extension';
import { GridExtension } from '../grid/grid.extension';
import { InstanceExtension } from '../instance/instance.extension';
import { LifeCycleExtension } from '../life-cycle/life-cycle.extension';
import { MetadataExtension } from '../metadata/metadata.extension';
import { ReadConfigExtension } from '../read-config/read-config.extension';
import { ViewModelExtension } from '../view-model/view-model.extension';
import { CheckVisibilityExtension } from '../visibility/check-visibility.extension';
const defaultExtensions = [
    CheckVisibilityExtension,
    MetadataExtension,
    GridExtension,
    DataSourceExtension,
    InstanceExtension,
    FormExtension,
    ViewModelExtension,
    ActionExtension,
    LifeCycleExtension
];
export class BuilderContext extends BasicBuilderContext {
    constructor(parent) {
        super();
        this.map = new Map();
        this.actions = [];
        this.coverts = [];
        this.extensions = [];
        parent && parent.extendsConfig(this);
    }
    extendsConfig(childContext) {
        childContext.registryExtension(this.extensions);
        childContext.uiElements.push(...this.uiElements);
        childContext.actions.push(...this.actions);
        childContext.coverts.push(...this.coverts);
    }
    useFactory(useFactory) {
        return (injector) => (...args) => useFactory(...args, injector);
    }
    registryFactory(injector, token) {
        const proxyFactory = this.map.get(token);
        if (proxyFactory) {
            injector.set(token, { provide: token, useFactory: this.useFactory(proxyFactory), deps: [Injector] });
        }
    }
    forwardGetJsonConfig(getJsonConfig) {
        this.map.set(GET_JSON_CONFIG, getJsonConfig);
    }
    forwardFormControl(factoryFormControl) {
        const proxyFactory = (value, options, injector) => {
            var _a;
            return factoryFormControl(value, (_a = injector.get(VALIDATOR_SERVICE)) === null || _a === void 0 ? void 0 : _a.getValidators(options), injector);
        };
        this.map.set(FORM_CONTROL, proxyFactory);
    }
    forwardBuilderLayout(createElement) {
        this.map.set(LAYOUT_ELEMENT, createElement);
    }
    forwardAction(name, action) {
        if (this.actions.some(({ name: actionName }) => actionName === name)) {
            console.info(`action: ${name}已经注册过!!!!`);
        }
        this.actions.push({ name, action });
    }
    forwardCovert(name, covert) {
        if (this.actions.some(({ name: covertName }) => covertName === name)) {
            console.info(`covert: ${name}已经注册过!!!!`);
        }
        this.coverts.push({ name, covert });
    }
    registryExtension(extensions) {
        this.extensions.push(...extensions);
    }
    registryInjector(injector) {
        super.registryInjector(injector);
        this.registryFactory(injector, GET_JSON_CONFIG);
        this.registryFactory(injector, FORM_CONTROL);
        this.registryFactory(injector, LAYOUT_ELEMENT);
        injector.set(ACTION_INTERCEPT, { provide: ACTION_INTERCEPT, useClass: Action });
        injector.set(COVERT_INTERCEPT, { provide: COVERT_INTERCEPT, useClass: Covert });
        injector.set(ACTIONS_CONFIG, { provide: ACTIONS_CONFIG, multi: true, useValue: this.actions });
        injector.set(COVERT_CONFIG, { provide: COVERT_CONFIG, multi: true, useValue: this.coverts });
        injector.set(LOAD_BUILDER_CONFIG, { provide: LOAD_BUILDER_CONFIG, useValue: ReadConfigExtension });
        injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: defaultExtensions });
        injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: this.extensions });
    }
}
export const useBuilderContext = (parent) => new BuilderContext(parent);

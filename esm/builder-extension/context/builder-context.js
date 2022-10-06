import { Injector } from '@fm/di';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
// eslint-disable-next-line max-len
import { ACTION_INTERCEPT, BUILDER_EXTENSION, FORM_CONTROL, GET_JSON_CONFIG, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG, VALIDATOR_SERVICE } from '../../token';
import { Action } from '../action/actions';
import { ActionExtension } from '../action/actions.extension';
import { DataSourceExtension } from '../datasource/datasource.extension';
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
    GridExtension,
    InstanceExtension,
    ViewModelExtension,
    FormExtension,
    DataSourceExtension,
    MetadataExtension,
    ActionExtension,
    LifeCycleExtension
];
export class BuilderContext extends BasicBuilderContext {
    constructor() {
        super(...arguments);
        this.map = new Map();
        this.extensions = defaultExtensions;
    }
    useFactory(useFactory) {
        return (injector, ...args) => useFactory(...args, injector);
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
    registryExtension(extensions) {
        this.extensions = this.extensions.concat(...extensions);
    }
    registryInjector(injector) {
        super.registryInjector(injector);
        this.registryFactory(injector, GET_JSON_CONFIG);
        this.registryFactory(injector, FORM_CONTROL);
        this.registryFactory(injector, LAYOUT_ELEMENT);
        injector.set(ACTION_INTERCEPT, { provide: ACTION_INTERCEPT, useClass: Action });
        injector.set(LOAD_BUILDER_CONFIG, { provide: LOAD_BUILDER_CONFIG, useValue: ReadConfigExtension });
        this.extensions.forEach((extension) => {
            injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: extension });
        });
    }
}
export const useBuilderContext = () => new BuilderContext();

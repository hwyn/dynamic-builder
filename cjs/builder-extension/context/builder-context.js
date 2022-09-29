"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuilderContext = exports.BuilderContext = void 0;
const di_1 = require("@fm/di");
const builder_context_1 = require("../../builder/builder-context");
// eslint-disable-next-line max-len
const token_1 = require("../../token");
const actions_1 = require("../action/actions");
const actions_extension_1 = require("../action/actions.extension");
const datasource_extension_1 = require("../datasource/datasource.extension");
const form_extension_1 = require("../form/form.extension");
const grid_extension_1 = require("../grid/grid.extension");
const instance_extension_1 = require("../instance/instance.extension");
const life_cycle_extension_1 = require("../life-cycle/life-cycle.extension");
const metadata_extension_1 = require("../metadata/metadata.extension");
const read_config_extension_1 = require("../read-config/read-config.extension");
const view_model_extension_1 = require("../view-model/view-model.extension");
const check_visibility_extension_1 = require("../visibility/check-visibility.extension");
const defaultExtensions = [
    check_visibility_extension_1.CheckVisibilityExtension,
    grid_extension_1.GridExtension,
    instance_extension_1.InstanceExtension,
    view_model_extension_1.ViewModelExtension,
    form_extension_1.FormExtension,
    datasource_extension_1.DataSourceExtension,
    metadata_extension_1.MetadataExtension,
    actions_extension_1.ActionExtension,
    life_cycle_extension_1.LifeCycleExtension
];
class BuilderContext extends builder_context_1.BuilderContext {
    map = new Map();
    extensions = defaultExtensions;
    useFactory(useFactory) {
        return (injector, ...args) => useFactory(...args, injector);
    }
    registryFactory(injector, token) {
        const proxyFactory = this.map.get(token);
        if (proxyFactory) {
            injector.set(token, { provide: token, useFactory: this.useFactory(proxyFactory), deps: [di_1.Injector] });
        }
    }
    forwardGetJsonConfig(getJsonConfig) {
        this.map.set(token_1.GET_JSON_CONFIG, getJsonConfig);
    }
    forwardFormControl(factoryFormControl) {
        const proxyFactory = (value, options, injector) => {
            return factoryFormControl(value, injector.get(token_1.VALIDATOR_SERVICE)?.getValidators(options), injector);
        };
        this.map.set(token_1.FORM_CONTROL, proxyFactory);
    }
    forwardBuilderLayout(createElement) {
        this.map.set(token_1.LAYOUT_ELEMENT, createElement);
    }
    registryExtension(extensions) {
        this.extensions = this.extensions.concat(...extensions);
    }
    registryInjector(injector) {
        super.registryInjector(injector);
        this.registryFactory(injector, token_1.GET_JSON_CONFIG);
        this.registryFactory(injector, token_1.FORM_CONTROL);
        this.registryFactory(injector, token_1.LAYOUT_ELEMENT);
        injector.set(token_1.ACTION_INTERCEPT, { provide: token_1.ACTION_INTERCEPT, useClass: actions_1.Action });
        injector.set(token_1.LOAD_BUILDER_CONFIG, { provide: token_1.LOAD_BUILDER_CONFIG, useValue: read_config_extension_1.ReadConfigExtension });
        this.extensions.forEach((extension) => {
            injector.set(token_1.BUILDER_EXTENSION, { provide: token_1.BUILDER_EXTENSION, multi: true, useValue: extension });
        });
    }
}
exports.BuilderContext = BuilderContext;
const useBuilderContext = () => new BuilderContext();
exports.useBuilderContext = useBuilderContext;

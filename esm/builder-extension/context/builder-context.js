import { deepProviders, getInjectableDef, Injector, setInjectableDef } from '@hwy-fm/di';
import { BuilderContext as BasicBuilderContext } from '../../builder/builder-context';
import { ACTION_INTERCEPT, ACTIONS_CONFIG, BUILDER_EXTENSION, CONVERT_CONFIG, CONVERT_INTERCEPT, EVENT_HOOK, FORM_CONTROL, GET_JSON_CONFIG, GET_TYPE, GRID_PARSE, LAYOUT_ELEMENT, LOAD_BUILDER_CONFIG } from '../../token';
import { EventHook } from '../action';
import { Action } from '../action/actions';
import { ActionExtension } from '../action/actions.extension';
import { DataSourceExtension } from '../datasource/datasource.extension';
import { Convert } from '../form/convert';
import { FormExtension } from '../form/form.extension';
import { Grid } from '../grid/grid';
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
export { BaseType } from './base-type';
export class BuilderContext extends BasicBuilderContext {
    constructor(parent) {
        super();
        this.parent = parent;
        this.extensions = [];
        this.map = new Map();
        this.typeMap = new Map();
        this.clsMap = new Map();
    }
    canExtends(injector) {
        var _a;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.canExtends(injector);
        super.registryInjector(injector);
        this.map.forEach((_factory, token) => this.registryFactory(injector, token));
        this.clsMap.forEach((cls, token) => injector.set(token, { provide: token, useClass: cls }));
        injector.set(BUILDER_EXTENSION, { provide: BUILDER_EXTENSION, multi: true, useValue: this.extensions });
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
    getType(token, name) {
        var _a;
        const list = this.typeMap.get(token) || [];
        for (let i = 0, item; i < list.length; i++) {
            item = list[i];
            if (item.name === name)
                return item[item.attr];
        }
        return ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.getType(token, name)) || null;
    }
    getFactory(token) {
        return this.map.get(token);
    }
    forwardClass(token, cls) {
        this.clsMap.set(token, cls);
    }
    forwardFactory(token, factory) {
        this.map.set(token, factory);
    }
    forwardType(token, name, target, typeName = 'target') {
        let list = this.typeMap.get(token);
        if (!list)
            this.typeMap.set(token, list = []);
        if (name && target) {
            if (list.some(({ name: typeName }) => typeName === name))
                console.info(`${typeName}: ${name}已经注册`);
            if (!getInjectableDef(target))
                setInjectableDef(target, { providedIn: 'any', nonSingle: true });
            target[`${typeName}Name`] = name;
            list.push({ name, attr: typeName, [typeName]: target });
        }
    }
    forwardGetJsonConfig(getJsonConfig) {
        this.forwardFactory(GET_JSON_CONFIG, getJsonConfig);
    }
    forwardFormControl(factoryFormControl) {
        this.forwardFactory(FORM_CONTROL, factoryFormControl);
    }
    forwardBuilderLayout(createElement) {
        this.forwardFactory(LAYOUT_ELEMENT, createElement);
    }
    forwardAction(name, action, options) {
        Object.assign(action, options);
        this.forwardType(ACTIONS_CONFIG, name, action, 'action');
    }
    forwardConvert(name, convert) {
        this.forwardType(CONVERT_CONFIG, name, convert, 'convert');
    }
    registryExtension(extensions) {
        this.extensions.push(...extensions);
    }
    registryInjector(injector) {
        deepProviders(injector, [
            { provide: BuilderContext, useValue: this },
            { provide: ACTION_INTERCEPT, useClass: Action },
            { provide: CONVERT_INTERCEPT, useClass: Convert },
            { provide: GET_TYPE, useValue: this.getType.bind(this) },
            { provide: GRID_PARSE, useFactory: this.useFactory(Grid.create) },
            { provide: EVENT_HOOK, useFactory: this.useFactory(EventHook.create) },
            { provide: LOAD_BUILDER_CONFIG, useValue: ReadConfigExtension },
            { provide: BUILDER_EXTENSION, multi: true, useValue: defaultExtensions }
        ]);
        this.canExtends(injector);
    }
}
export const useBuilderContext = (parent) => new BuilderContext(parent);

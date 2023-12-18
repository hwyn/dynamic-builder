import { __rest } from "tslib";
import { deepProviders, InjectFlags, Injector } from '@fm/di';
import { FACTORY_BUILDER, META_PROPS, META_TYPE, SCOPE_MODEL, SCOPE_PROPS, UI_ELEMENT } from '../token';
import { BuilderEngine } from './builder-engine.service';
import { BuilderModel } from './builder-model';
import { BuilderScope } from './builder-scope';
import { BUILDER_DEF } from './decorator';
const _contextProvs = [
    BuilderScope,
    { provide: SCOPE_MODEL, useExisting: BuilderScope },
    { provide: META_PROPS, deps: [BuilderScope], useFactory: (builder) => builder.resetMetaTypeProps() }
];
export class BuilderContext {
    constructor() {
        this.uiElements = [];
    }
    forwardUiElement(name, Element) {
        this.uiElements.push({ name, component: Element });
        return Element;
    }
    factoryBuilder(injector) {
        return (_a) => {
            var _b;
            var { BuilderModel: NB = BuilderModel, providers = [], context } = _a, props = __rest(_a, ["BuilderModel", "providers", "context"]);
            let model;
            let _injector = ((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector;
            if (NB[BUILDER_DEF] && !(Object.create(NB.prototype) instanceof BuilderModel)) {
                const _providers = [{ provide: META_TYPE, useExisting: NB }, _contextProvs, NB, providers];
                _injector = Injector.create([], _injector);
                context === null || context === void 0 ? void 0 : context.registryInjector(_injector);
                deepProviders(_injector, [{ provide: SCOPE_PROPS, useValue: { props } }, _providers]);
                model = _injector.get(BuilderScope);
            }
            return (model || _injector.get(NB, InjectFlags.NonCache)).loadForBuild(props);
        };
    }
    registryInjector(injector) {
        deepProviders(injector, [
            { provide: UI_ELEMENT, multi: true, useValue: this.uiElements },
            { provide: BuilderEngine, useClass: BuilderEngine, deps: [UI_ELEMENT] },
            { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [Injector] }
        ]);
    }
}

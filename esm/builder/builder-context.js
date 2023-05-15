import { __rest } from "tslib";
import { InjectFlags, Injector } from '@fm/di';
import { FACTORY_BUILDER, META_TYPE, UI_ELEMENT } from '../token';
import { BuilderEngine } from './builder-engine.service';
import { BuilderModel } from './builder-model';
import { BuilderScope } from './builder-scope';
import { BUILDER_DEF } from './decorator';
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
            let _injector = ((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector;
            if (NB[BUILDER_DEF] && !(Object.create(NB.prototype) instanceof BuilderModel)) {
                _injector = Injector.create([providers, NB, { provide: META_TYPE, useExisting: NB }], _injector);
                context === null || context === void 0 ? void 0 : context.registryInjector(_injector);
                NB = BuilderScope;
            }
            return _injector.get(NB, InjectFlags.NonCache).loadForBuild(props);
        };
    }
    registryInjector(injector) {
        injector.set(UI_ELEMENT, { provide: UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(BuilderEngine, { provide: BuilderEngine, useClass: BuilderEngine, deps: [UI_ELEMENT] });
        injector.set(FACTORY_BUILDER, { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [Injector] });
    }
}

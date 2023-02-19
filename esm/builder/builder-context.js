import { __rest } from "tslib";
import { Injector } from '@fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderEngine } from './builder-engine.service';
import { BuilderModel } from './builder-model';
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
<<<<<<< HEAD
            var _b;
            var { BuilderModel: NB = BuilderModel } = _a, props = __rest(_a, ["BuilderModel"]);
            return new NB(((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector, props).loadForBuild(props);
=======
            var { BuilderModel: NB = BuilderModel } = _a, props = __rest(_a, ["BuilderModel"]);
            return new NB(injector).loadForBuild(props);
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        };
    }
    registryInjector(injector) {
        injector.set(UI_ELEMENT, { provide: UI_ELEMENT, multi: true, useValue: this.uiElements });
<<<<<<< HEAD
        injector.set(BuilderEngine, { provide: BuilderEngine, useClass: BuilderEngine, deps: [UI_ELEMENT] });
=======
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        injector.set(FACTORY_BUILDER, { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [Injector] });
    }
}

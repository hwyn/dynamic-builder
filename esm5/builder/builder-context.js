import { __rest } from "tslib";
import { getInjectableDef, InjectFlags, Injector, setInjectableDef } from '@fm/di';
import { FACTORY_BUILDER, UI_ELEMENT } from '../token';
import { BuilderEngine } from './builder-engine.service';
import { BuilderModel } from './builder-model';
var BuilderContext = /** @class */ (function () {
    function BuilderContext() {
        this.uiElements = [];
    }
    BuilderContext.prototype.forwardUiElement = function (name, Element) {
        this.uiElements.push({ name: name, component: Element });
        return Element;
    };
    BuilderContext.prototype.factoryBuilder = function (injector) {
        return function (_a) {
            var _b;
            var _c = _a.BuilderModel, NB = _c === void 0 ? BuilderModel : _c, props = __rest(_a, ["BuilderModel"]);
            if (!getInjectableDef(NB))
                setInjectableDef(NB, { providedIn: 'any' });
            return (((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector).get(NB, InjectFlags.NonCache).loadForBuild(props);
        };
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        injector.set(UI_ELEMENT, { provide: UI_ELEMENT, multi: true, useValue: this.uiElements });
        injector.set(BuilderEngine, { provide: BuilderEngine, useClass: BuilderEngine, deps: [UI_ELEMENT] });
        injector.set(FACTORY_BUILDER, { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [Injector] });
    };
    return BuilderContext;
}());
export { BuilderContext };

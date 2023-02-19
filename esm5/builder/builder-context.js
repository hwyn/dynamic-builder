import { __rest } from "tslib";
import { Injector } from '@fm/di';
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
<<<<<<< HEAD
            var _b;
            var _c = _a.BuilderModel, NB = _c === void 0 ? BuilderModel : _c, props = __rest(_a, ["BuilderModel"]);
            return new NB(((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector, props).loadForBuild(props);
=======
            var _b = _a.BuilderModel, NB = _b === void 0 ? BuilderModel : _b, props = __rest(_a, ["BuilderModel"]);
            return new NB(injector).loadForBuild(props);
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        };
    };
    BuilderContext.prototype.registryInjector = function (injector) {
        injector.set(UI_ELEMENT, { provide: UI_ELEMENT, multi: true, useValue: this.uiElements });
<<<<<<< HEAD
        injector.set(BuilderEngine, { provide: BuilderEngine, useClass: BuilderEngine, deps: [UI_ELEMENT] });
=======
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        injector.set(FACTORY_BUILDER, { provide: FACTORY_BUILDER, useFactory: this.factoryBuilder, deps: [Injector] });
    };
    return BuilderContext;
}());
export { BuilderContext };

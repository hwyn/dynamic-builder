import { __rest } from "tslib";
import { InjectFlags, Injector } from '@fm/di';
import { FACTORY_BUILDER, META_PROPS, META_TYPE, SCOPE_MODEL, SCOPE_PROPS, UI_ELEMENT } from '../token';
import { BuilderEngine } from './builder-engine.service';
import { BuilderModel } from './builder-model';
import { BuilderScope } from './builder-scope';
import { BUILDER_DEF } from './decorator';
var _contextProvs = [
    BuilderScope,
    { provide: SCOPE_MODEL, useExisting: BuilderScope },
    { provide: META_PROPS, deps: [BuilderScope], useFactory: function (builder) { return builder.resetMetaTypeProps(); } }
];
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
            var _c = _a.BuilderModel, NB = _c === void 0 ? BuilderModel : _c, _d = _a.providers, providers = _d === void 0 ? [] : _d, context = _a.context, props = __rest(_a, ["BuilderModel", "providers", "context"]);
            var model;
            var _injector = ((_b = props.builder) === null || _b === void 0 ? void 0 : _b.injector) || injector;
            if (NB[BUILDER_DEF] && !(Object.create(NB.prototype) instanceof BuilderModel)) {
                var _providers = [_contextProvs, NB, providers, { provide: META_TYPE, useExisting: NB }];
                _injector = Injector.create([_providers, { provide: SCOPE_PROPS, useValue: { props: props } }], _injector);
                context === null || context === void 0 ? void 0 : context.registryInjector(_injector);
                model = _injector.get(BuilderScope);
            }
            return (model || _injector.get(NB, InjectFlags.NonCache)).loadForBuild(props);
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

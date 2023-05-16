import { __assign } from "tslib";
import { Inject, Injector, makeDecorator, makeMethodDecorator, setInjectableDef } from '@fm/di';
import { SCOPE_MODEL, SCOPE_PROPS } from '../token';
export var BUILDER_DEF = '__builder_def__';
export var INPUT_PROPS = 'InputProps';
export var ROOT_MODEL = 'ROOT_MODEL';
export var DYNAMIC_BUILDER = 'DynamicBuilder';
var forwardTemplate = function (type) { return type; };
function typeFn(cls, meta) {
    setInjectableDef(cls, __assign(__assign({}, meta), { providedIn: 'any' }));
}
export function makeBuilderDecorator(name, forward) {
    if (forward === void 0) { forward = forwardTemplate; }
    var builderDecorator = makeDecorator(name, function (props) { return props; }, typeFn);
    return function (props) { return function (cls) {
        if (name !== DYNAMIC_BUILDER) {
            Object.defineProperty(cls, BUILDER_DEF, { value: true });
        }
        return forward(builderDecorator(props)(cls), props);
    }; };
}
var methodToProp = function (typeDecorator) { return function (ctor, method, decorator) {
    return typeDecorator(ctor.prototype, method, typeof decorator === 'number' ? decorator : undefined);
}; };
var inputTransform = function (_meta, injector, _type, prop) { var _a; return (_a = injector.get(SCOPE_PROPS)) === null || _a === void 0 ? void 0 : _a.props[prop]; };
var _InputProps = Inject(Injector, { metadataName: INPUT_PROPS, transform: inputTransform });
export var DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);
export var RootModel = makeMethodDecorator(ROOT_MODEL, undefined, methodToProp(Inject(SCOPE_MODEL, { metadataName: ROOT_MODEL })));
export var InputProps = makeMethodDecorator(INPUT_PROPS, undefined, methodToProp(_InputProps));

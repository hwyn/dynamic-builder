import { __assign } from "tslib";
import { getInjectableDef, Inject, Injector, makeDecorator, makePropDecorator, setInjectableDef } from '@fm/di';
import { get } from 'lodash';
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
    var builderDecorator = makeDecorator(name, function (props) { return props; });
    return function (props) { return function (cls) {
        if (name !== DYNAMIC_BUILDER) {
            Object.defineProperty(cls, BUILDER_DEF, { value: true });
        }
        var result = forward(builderDecorator(props)(cls), props);
        if (!getInjectableDef(cls))
            typeFn(cls, props);
        return result;
    }; };
}
var methodToProp = function (typeDecorator) { return function (ctor, method, index) {
    var isParams = typeof index === 'number';
    var meta = ctor[isParams ? '__parameters__' : '__prop__metadata__'];
    typeDecorator(meta.shift().annotationInstance)(isParams ? ctor : ctor.prototype, method, index);
}; };
export var makeCustomInputProps = function (transform) {
    var inputTransform = function (meta, _, type, prop) { var _a; return transform(meta, (_a = _.get(SCOPE_PROPS)) === null || _a === void 0 ? void 0 : _a.props, type, prop); };
    var inputProps = function (annotation) { return Inject(Injector, __assign(__assign({}, annotation), { metadataName: INPUT_PROPS, transform: inputTransform })); };
    return makePropDecorator(INPUT_PROPS, function (key) { return ({ key: key }); }, methodToProp(inputProps));
};
export var DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);
export var RootModel = makePropDecorator(ROOT_MODEL, undefined, methodToProp(function () { return Inject(SCOPE_MODEL, { metadataName: ROOT_MODEL }); }));
export var InputProps = makeCustomInputProps(function (meta, p, type, prop) { var _a; return get(p, (_a = meta.key) !== null && _a !== void 0 ? _a : prop, type[prop]); });

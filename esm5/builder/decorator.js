import { __assign } from "tslib";
import { getInjectableDef, Inject, Injector, makeDecorator, setInjectableDef } from '@fm/di';
import { get } from 'lodash';
import { SCOPE_MODEL, SCOPE_PROPS } from '../token';
export var BUILDER_DEF = '__builder_def__';
export var INPUT_PROPS = 'InputProps';
export var ROOT_MODEL = 'ROOT_MODEL';
export var DYNAMIC_BUILDER = 'DynamicBuilder';
var forwardTemplate = function (type) { return type; };
function typeFn(cls, meta) {
    var providedIn = !cls[BUILDER_DEF] ? 'any' : Object.create({});
    setInjectableDef(cls, __assign({ providedIn: providedIn }, meta));
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
export var makeCustomInputProps = function (transform) {
    var inputTransform = function (meta, _, type, prop) { var _a; return transform(meta, (_a = _.get(SCOPE_PROPS)) === null || _a === void 0 ? void 0 : _a.props, type, prop); };
    return function (key) { return Inject(Injector, { metadataName: INPUT_PROPS, key: key, transform: inputTransform }); };
};
export var DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);
export var RootModel = function () { return Inject(SCOPE_MODEL, { metadataName: ROOT_MODEL }); };
export var InputProps = makeCustomInputProps(function (meta, p, type, prop) { var _a; return get(p, (_a = meta.key) !== null && _a !== void 0 ? _a : prop, type[prop]); });

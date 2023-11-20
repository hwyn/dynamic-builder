import { getInjectableDef, Inject, Injector, makeDecorator, makePropDecorator, setInjectableDef } from '@fm/di';
import { get } from 'lodash';
import { SCOPE_MODEL, SCOPE_PROPS } from '../token';
export const BUILDER_DEF = '__builder_def__';
export const INPUT_PROPS = 'InputProps';
export const ROOT_MODEL = 'ROOT_MODEL';
export const DYNAMIC_BUILDER = 'DynamicBuilder';
const forwardTemplate = (type) => type;
function typeFn(cls, meta) {
    setInjectableDef(cls, Object.assign(Object.assign({}, meta), { providedIn: 'any' }));
}
export function makeBuilderDecorator(name, forward = forwardTemplate) {
    const builderDecorator = makeDecorator(name, (props) => props);
    return (props) => (cls) => {
        if (name !== DYNAMIC_BUILDER) {
            Object.defineProperty(cls, BUILDER_DEF, { value: true });
        }
        const result = forward(builderDecorator(props)(cls), props);
        if (!getInjectableDef(cls))
            typeFn(cls, props);
        return result;
    };
}
const methodToProp = (typeDecorator) => (ctor, method, index) => {
    const isParams = typeof index === 'number';
    const meta = ctor[isParams ? '__parameters__' : '__prop__metadata__'];
    typeDecorator(meta.shift().annotationInstance)(isParams ? ctor : ctor.prototype, method, index);
};
export const makeCustomInputProps = (transform) => {
    const inputTransform = (meta, _, type, prop) => { var _a; return transform(meta, (_a = _.get(SCOPE_PROPS)) === null || _a === void 0 ? void 0 : _a.props, type, prop); };
    const inputProps = (annotation) => Inject(Injector, Object.assign(Object.assign({}, annotation), { metadataName: INPUT_PROPS, transform: inputTransform }));
    return makePropDecorator(INPUT_PROPS, (key) => ({ key }), methodToProp(inputProps));
};
export const DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);
export const RootModel = makePropDecorator(ROOT_MODEL, undefined, methodToProp(() => Inject(SCOPE_MODEL, { metadataName: ROOT_MODEL })));
export const InputProps = makeCustomInputProps((meta, p, type, prop) => { var _a; return get(p, (_a = meta.key) !== null && _a !== void 0 ? _a : prop, type[prop]); });

import { getInjectableDef, Inject, Injector, makeDecorator, setInjectableDef } from '@fm/di';
import { get } from 'lodash';
import { SCOPE_MODEL, SCOPE_PROPS } from '../token';
export const BUILDER_DEF = '__builder_def__';
export const INPUT_PROPS = 'InputProps';
export const ROOT_MODEL = 'ROOT_MODEL';
export const DYNAMIC_BUILDER = 'DynamicBuilder';
const forwardTemplate = (type) => type;
function typeFn(cls, meta) {
    const providedIn = !cls[BUILDER_DEF] ? 'any' : Object.create({});
    setInjectableDef(cls, Object.assign({ providedIn }, meta));
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
export const makeCustomInputProps = (transform) => {
    const inputTransform = (meta, _, type, prop) => { var _a; return transform(meta, (_a = _.get(SCOPE_PROPS)) === null || _a === void 0 ? void 0 : _a.props, type, prop); };
    return (key) => Inject(Injector, { metadataName: INPUT_PROPS, key, transform: inputTransform });
};
export const DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);
export const RootModel = () => Inject(SCOPE_MODEL, { metadataName: ROOT_MODEL });
export const InputProps = makeCustomInputProps((meta, p, type, prop) => { var _a; return get(p, (_a = meta.key) !== null && _a !== void 0 ? _a : prop, type[prop]); });

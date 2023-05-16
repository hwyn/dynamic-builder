import { Inject, Injector, makeDecorator, makeMethodDecorator, setInjectableDef } from '@fm/di';
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
    const builderDecorator = makeDecorator(name, (props) => props, typeFn);
    return (props) => (cls) => {
        if (name !== DYNAMIC_BUILDER) {
            Object.defineProperty(cls, BUILDER_DEF, { value: true });
        }
        return forward(builderDecorator(props)(cls), props);
    };
}
const methodToProp = (typeDecorator) => (ctor, method, decorator) => {
    return typeDecorator(ctor.prototype, method, typeof decorator === 'number' ? decorator : undefined);
};
const inputTransform = (_meta, injector, _type, prop) => { var _a; return (_a = injector.get(SCOPE_PROPS)) === null || _a === void 0 ? void 0 : _a.props[prop]; };
const _InputProps = Inject(Injector, { metadataName: INPUT_PROPS, transform: inputTransform });
export const DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);
export const RootModel = makeMethodDecorator(ROOT_MODEL, undefined, methodToProp(Inject(SCOPE_MODEL, { metadataName: ROOT_MODEL })));
export const InputProps = makeMethodDecorator(INPUT_PROPS, undefined, methodToProp(_InputProps));

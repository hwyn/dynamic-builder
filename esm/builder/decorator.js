import { makeDecorator, setInjectableDef } from '@fm/di';
export const BUILDER_DEF = '__builder_def__';
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
export const DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);

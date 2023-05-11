import { makeDecorator, setInjectableDef } from '@fm/di';
import { DYNAMIC_BUILDER } from './consts';
const forwardTemplate = (type) => type;
function typeFn(cls, meta) {
    setInjectableDef(cls, Object.assign(Object.assign({}, meta), { providedIn: 'any' }));
}
export function makeBuilderDecorator(name, forward = forwardTemplate) {
    const builderDecorator = makeDecorator(name, (props) => props, typeFn);
    return (props) => (cls) => forward(builderDecorator(props)(cls), props);
}
export const DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);

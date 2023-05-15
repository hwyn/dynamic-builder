import { __assign } from "tslib";
import { makeDecorator, setInjectableDef } from '@fm/di';
export var BUILDER_DEF = '__builder_def__';
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
export var DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);

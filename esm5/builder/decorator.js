import { __assign } from "tslib";
import { makeDecorator, setInjectableDef } from '@fm/di';
import { DYNAMIC_BUILDER } from './consts';
var forwardTemplate = function (type) { return type; };
function typeFn(cls, meta) {
    setInjectableDef(cls, __assign(__assign({}, meta), { providedIn: 'any' }));
}
export function makeBuilderDecorator(name, forward) {
    if (forward === void 0) { forward = forwardTemplate; }
    var builderDecorator = makeDecorator(name, function (props) { return props; }, typeFn);
    return function (props) { return function (cls) { return forward(builderDecorator(props)(cls), props); }; };
}
export var DynamicModel = makeBuilderDecorator(DYNAMIC_BUILDER);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicModel = exports.makeBuilderDecorator = exports.DYNAMIC_BUILDER = exports.BUILDER_DEF = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
exports.BUILDER_DEF = '__builder_def__';
exports.DYNAMIC_BUILDER = 'DynamicBuilder';
var forwardTemplate = function (type) { return type; };
function typeFn(cls, meta) {
    (0, di_1.setInjectableDef)(cls, tslib_1.__assign(tslib_1.__assign({}, meta), { providedIn: 'any' }));
}
function makeBuilderDecorator(name, forward) {
    if (forward === void 0) { forward = forwardTemplate; }
    var builderDecorator = (0, di_1.makeDecorator)(name, function (props) { return props; }, typeFn);
    return function (props) { return function (cls) {
        if (name !== exports.DYNAMIC_BUILDER) {
            Object.defineProperty(cls, exports.BUILDER_DEF, { value: true });
        }
        return forward(builderDecorator(props)(cls), props);
    }; };
}
exports.makeBuilderDecorator = makeBuilderDecorator;
exports.DynamicModel = makeBuilderDecorator(exports.DYNAMIC_BUILDER);

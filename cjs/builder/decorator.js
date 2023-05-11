"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicModel = exports.makeBuilderDecorator = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var consts_1 = require("./consts");
var forwardTemplate = function (type) { return type; };
function typeFn(cls, meta) {
    (0, di_1.setInjectableDef)(cls, tslib_1.__assign(tslib_1.__assign({}, meta), { providedIn: 'any' }));
}
function makeBuilderDecorator(name, forward) {
    if (forward === void 0) { forward = forwardTemplate; }
    var builderDecorator = (0, di_1.makeDecorator)(name, function (props) { return props; }, typeFn);
    return function (props) { return function (cls) { return forward(builderDecorator(props)(cls), props); }; };
}
exports.makeBuilderDecorator = makeBuilderDecorator;
exports.DynamicModel = makeBuilderDecorator(consts_1.DYNAMIC_BUILDER);

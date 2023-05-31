"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputProps = exports.RootModel = exports.DynamicModel = exports.makeCustomInputProps = exports.makeBuilderDecorator = exports.DYNAMIC_BUILDER = exports.ROOT_MODEL = exports.INPUT_PROPS = exports.BUILDER_DEF = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var token_1 = require("../token");
exports.BUILDER_DEF = '__builder_def__';
exports.INPUT_PROPS = 'InputProps';
exports.ROOT_MODEL = 'ROOT_MODEL';
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
var methodToProp = function (typeDecorator) { return function (ctor, method, index) {
    var isParams = typeof index === 'number';
    var meta = ctor[isParams ? '__parameters__' : '__prop__metadata__'];
    typeDecorator(meta.shift().annotationInstance)(isParams ? ctor : ctor.prototype, method, index);
}; };
var makeCustomInputProps = function (transform) {
    var inputTransform = function (meta, _, type, prop) { var _a; return transform(meta, (_a = _.get(token_1.SCOPE_PROPS)) === null || _a === void 0 ? void 0 : _a.props, type, prop); };
    var inputProps = function (annotation) { return (0, di_1.Inject)(di_1.Injector, tslib_1.__assign(tslib_1.__assign({}, annotation), { metadataName: exports.INPUT_PROPS, transform: inputTransform })); };
    return (0, di_1.makePropDecorator)(exports.INPUT_PROPS, function (key) { return ({ key: key }); }, methodToProp(inputProps));
};
exports.makeCustomInputProps = makeCustomInputProps;
exports.DynamicModel = makeBuilderDecorator(exports.DYNAMIC_BUILDER);
exports.RootModel = (0, di_1.makePropDecorator)(exports.ROOT_MODEL, undefined, methodToProp(function () { return (0, di_1.Inject)(token_1.SCOPE_MODEL, { metadataName: exports.ROOT_MODEL }); }));
exports.InputProps = (0, exports.makeCustomInputProps)(function (meta, p, type, prop) { var _a; return (0, lodash_1.get)(p, (_a = meta.key) !== null && _a !== void 0 ? _a : prop, type[prop]); });

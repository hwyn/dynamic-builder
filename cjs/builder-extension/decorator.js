"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionProps = exports.OtherEvent = exports.CallLink = exports.Event = exports.InstanceRef = exports.ViewModelRef = exports.InterceptRef = exports.BuilderRef = exports.FieldRef = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var ActionParams;
(function (ActionParams) {
    ActionParams["event"] = "event";
    ActionParams["field"] = "field";
    ActionParams["builder"] = "builder";
    ActionParams["callLink"] = "callLink";
    ActionParams["viewModel"] = "viewModel";
    ActionParams["intercept"] = "intercept";
    ActionParams["otherEvent"] = "otherEvent";
    ActionParams["instanceRef"] = "instanceRef";
    ActionParams["actionProps"] = "actionProps";
})(ActionParams || (ActionParams = {}));
function getObjectByKey(obj, _a) {
    var key = _a.key;
    return key ? obj && (0, lodash_1.get)(obj, key) : obj;
}
function transform(annotation, value, baseAction) {
    var _a;
    var otherEvent = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        otherEvent[_i - 3] = arguments[_i];
    }
    switch (annotation.metadataName) {
        case ActionParams.otherEvent: return otherEvent;
        case ActionParams.builder: return baseAction.builder;
        case ActionParams.callLink: return baseAction.callLink;
        case ActionParams.instanceRef: return baseAction.instance;
        case ActionParams.intercept: return baseAction.actionIntercept;
        case ActionParams.event: return getObjectByKey(baseAction.actionEvent, annotation);
        case ActionParams.field: return getObjectByKey(baseAction.builderField, annotation);
        case ActionParams.actionProps: return getObjectByKey(baseAction.actionProps, annotation);
        case ActionParams.viewModel: return getObjectByKey((_a = baseAction.builder) === null || _a === void 0 ? void 0 : _a.viewModel, annotation);
    }
    return value;
}
var props = function (obj) {
    if (obj === void 0) { obj = {}; }
    return (tslib_1.__assign({ transform: transform }, obj));
};
var keyProps = function (key) { return props({ key: key }); };
exports.FieldRef = (0, di_1.makeParamDecorator)(ActionParams.field, keyProps);
exports.BuilderRef = (0, di_1.makeParamDecorator)(ActionParams.builder, props);
exports.InterceptRef = (0, di_1.makeParamDecorator)(ActionParams.intercept, props);
exports.ViewModelRef = (0, di_1.makeParamDecorator)(ActionParams.viewModel, keyProps);
exports.InstanceRef = (0, di_1.makeParamDecorator)(ActionParams.instanceRef, keyProps);
exports.Event = (0, di_1.makeParamDecorator)(ActionParams.event, keyProps);
exports.CallLink = (0, di_1.makeParamDecorator)(ActionParams.callLink, keyProps);
exports.OtherEvent = (0, di_1.makeParamDecorator)(ActionParams.otherEvent, keyProps);
exports.ActionProps = (0, di_1.makeParamDecorator)(ActionParams.actionProps, keyProps);

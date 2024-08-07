"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionProps = exports.OtherEvent = exports.CallLink = exports.Event = exports.Output = exports.ViewModelRef = exports.InstanceRef = exports.InterceptRef = exports.BuilderRef = exports.FieldRef = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@hwy-fm/di");
var lodash_1 = require("lodash");
var operators_1 = require("rxjs/operators");
var decorator_1 = require("../builder/decorator");
var action_1 = require("./action");
var event_zip_1 = require("./action/event-zip");
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
var proxyOutput = function (_m, props, type, prop) { return function (event) {
    var otherEvent = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        otherEvent[_i - 1] = arguments[_i];
    }
    var p = (0, action_1.getEventType)(prop);
    var output = (0, lodash_1.get)(props === null || props === void 0 ? void 0 : props.events, p, type[p]);
    var value = output.apply(void 0, tslib_1.__spreadArray([new event_zip_1.EventZip(event)], otherEvent, false));
    value.pipe((0, operators_1.tap)(function (v) { return value = v; }));
    return value;
}; };
var props = function (obj) {
    if (obj === void 0) { obj = {}; }
    return (tslib_1.__assign({ transform: transform }, obj));
};
var keyProps = function (key) { return props({ key: key }); };
exports.FieldRef = (0, di_1.makeParamDecorator)(ActionParams.field, keyProps);
exports.BuilderRef = (0, di_1.makeParamDecorator)(ActionParams.builder, props);
exports.InterceptRef = (0, di_1.makeParamDecorator)(ActionParams.intercept, props);
exports.InstanceRef = (0, di_1.makeParamDecorator)(ActionParams.instanceRef, props);
exports.ViewModelRef = (0, di_1.makeParamDecorator)(ActionParams.viewModel, keyProps);
exports.Output = (0, decorator_1.makeCustomInputProps)(proxyOutput);
exports.Event = (0, di_1.makeParamDecorator)(ActionParams.event, keyProps);
exports.CallLink = (0, di_1.makeParamDecorator)(ActionParams.callLink, props);
exports.OtherEvent = (0, di_1.makeParamDecorator)(ActionParams.otherEvent, props);
exports.ActionProps = (0, di_1.makeParamDecorator)(ActionParams.actionProps, keyProps);

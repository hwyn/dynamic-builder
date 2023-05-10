import { __assign } from "tslib";
import { makeParamDecorator } from '@fm/di';
import { get } from 'lodash';
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
    return key ? obj && get(obj, key) : obj;
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
    return (__assign({ transform: transform }, obj));
};
var keyProps = function (key) { return props({ key: key }); };
export var FieldRef = makeParamDecorator(ActionParams.field, keyProps);
export var BuilderRef = makeParamDecorator(ActionParams.builder, props);
export var InterceptRef = makeParamDecorator(ActionParams.intercept, props);
export var ViewModelRef = makeParamDecorator(ActionParams.viewModel, keyProps);
export var InstanceRef = makeParamDecorator(ActionParams.instanceRef, keyProps);
export var Event = makeParamDecorator(ActionParams.event, keyProps);
export var CallLink = makeParamDecorator(ActionParams.callLink, keyProps);
export var OtherEvent = makeParamDecorator(ActionParams.otherEvent, keyProps);
export var ActionProps = makeParamDecorator(ActionParams.actionProps, keyProps);

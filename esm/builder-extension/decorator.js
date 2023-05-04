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
function getObjectByKey(obj, { key }) {
    return key ? obj && get(obj, key) : obj;
}
function transform(annotation, value, baseAction, ...otherEvent) {
    var _a;
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
export const Builder = makeParamDecorator(ActionParams.builder, () => ({ transform }));
export const Intercept = makeParamDecorator(ActionParams.intercept, () => ({ transform }));
export const Event = makeParamDecorator(ActionParams.event, (key) => ({ key, transform }));
export const Field = makeParamDecorator(ActionParams.field, (key) => ({ key, transform }));
export const CallLink = makeParamDecorator(ActionParams.callLink, (key) => ({ key, transform }));
export const ViewModel = makeParamDecorator(ActionParams.viewModel, (key) => ({ key, transform }));
export const OtherEvent = makeParamDecorator(ActionParams.otherEvent, (key) => ({ key, transform }));
export const ActionProps = makeParamDecorator(ActionParams.actionProps, (key) => ({ key, transform }));
export const InstanceRef = makeParamDecorator(ActionParams.instanceRef, (key) => ({ key, transform }));

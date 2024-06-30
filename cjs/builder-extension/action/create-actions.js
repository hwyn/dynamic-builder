"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActions = void 0;
exports.getEventType = getEventType;
exports.getActionType = getActionType;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var token_1 = require("../../token");
var utility_1 = require("../../utility");
var event_zip_1 = require("./event-zip");
function mergeHandler(actions, props, options) {
    var actionIntercept = options.injector.get(token_1.ACTION_INTERCEPT);
    var isMore = actions.length > 1;
    var runObservable = actions.some(function (_a) {
        var runObservable = _a.runObservable;
        return runObservable;
    });
    isMore && console.warn("".concat(props.id, " Repeat listen event: ").concat(actions[0].type));
    return function eventHandler(event) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var _a = options.interceptFn, interceptFn = _a === void 0 ? function () { return event; } : _a;
        var obs = (0, utility_1.transformObservable)(interceptFn.apply(void 0, tslib_1.__spreadArray([props, event], arg, false))).pipe((0, utility_1.observableMap)(function (value) { return actionIntercept.invoke.apply(actionIntercept, tslib_1.__spreadArray([actions, props, value], arg, false)); }));
        return runObservable || event instanceof event_zip_1.EventZip ? obs : obs.subscribe();
    };
}
function getEventType(type) {
    return "on".concat(type[0].toUpperCase()).concat(type.slice(1));
}
function getActionType(type) {
    return type[2].toLowerCase() + type.slice(3);
}
var createActions = function (actions, props, options) {
    var events = (0, lodash_1.groupBy)(actions, 'type');
    return Object.keys(events).reduce(function (obj, type) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, obj), (_a = {}, _a[getEventType(type)] = mergeHandler(events[type], props, options), _a)));
    }, {});
};
exports.createActions = createActions;

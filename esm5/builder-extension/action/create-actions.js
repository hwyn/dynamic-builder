import { __assign, __spreadArray } from "tslib";
import { groupBy } from 'lodash';
import { ACTION_INTERCEPT } from '../../token';
import { observableMap, transformObservable } from '../../utility';
function mergeHandler(actions, props, options) {
    var actionIntercept = options.injector.get(ACTION_INTERCEPT);
    var isMore = actions.length > 1;
    var runObservable = actions.some(function (_a) {
        var runObservable = _a.runObservable;
        return runObservable;
    });
    isMore && console.warn("".concat(props.id, " Repeat listen event: ").concat(actions[0].type));
    return function (event) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var _a = options.interceptFn, interceptFn = _a === void 0 ? function () { return event; } : _a;
        var obs = transformObservable(interceptFn.apply(void 0, __spreadArray([props, event], arg, false))).pipe(observableMap(function (value) { return actionIntercept.invoke.apply(actionIntercept, __spreadArray([actions, props, value], arg, false)); }));
        return runObservable ? obs : obs.subscribe();
    };
}
export function getEventType(type) {
    return "on".concat(type[0].toUpperCase()).concat(type.slice(1));
}
export function getActionType(type) {
    return type[2].toLowerCase() + type.slice(3);
}
export var createActions = function (actions, props, options) {
    var events = groupBy(actions, 'type');
    props.builder.$$cache.bindFn.push(function () { return delete props.builder; });
    return Object.keys(events).reduce(function (obj, type) {
        var _a;
        return (__assign(__assign({}, obj), (_a = {}, _a[getEventType(type)] = mergeHandler(events[type], props, options), _a)));
    }, {});
};

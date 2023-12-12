import { __assign, __decorate, __metadata, __param, __spreadArray } from "tslib";
import { Inject, Injector, MethodProxy } from '@fm/di';
import { isEmpty } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG, GET_TYPE } from '../../token';
import { funcToObservable, observableMap, observableTap, serializeAction, toForkJoin, transformObservable } from '../../utility';
import { BaseAction } from './base.action';
import { EventZip } from './event-zip';
var Action = /** @class */ (function () {
    function Action(mp, injector, getType) {
        this.mp = mp;
        this.injector = injector;
        this.getType = getType;
    }
    Action.prototype.getCacheAction = function (ActionType, baseAction) {
        var _a;
        var _b = baseAction, builder = _b.builder, context = _b.context, _uid = _b.actionProps._uid, builderField = _b.builderField;
        var _c = (builderField || {}).cacheAction, cacheAction = _c === void 0 ? [] : _c;
        var cacheType = (_a = cacheAction.find(function (_a) {
            var uid = _a.uid;
            return _uid === uid;
        })) === null || _a === void 0 ? void 0 : _a.action;
        if (!cacheType) {
            var injector = (builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector;
            cacheType = injector.get(ActionType).invoke(context);
            if (!ActionType.cache || !builderField || !_uid)
                return cacheType;
            builderField.cacheAction && cacheAction.push({ uid: _uid, action: cacheType });
        }
        return cacheType.invoke(context);
    };
    Action.prototype.createEvent = function (event, otherEventParam) {
        if (otherEventParam === void 0) { otherEventParam = []; }
        return __spreadArray([event], otherEventParam, true);
    };
    Action.prototype.createCallLinkType = function (_a, _b, input, out) {
        var type = _a.type, _c = _a.callLink, callLink = _c === void 0 ? [] : _c;
        var id = _b.id;
        return __spreadArray(__spreadArray([], callLink, true), [{ fieldId: id, type: type, input: input, out: out }], false);
    };
    Action.prototype.getActionContext = function (_a) {
        var _b = _a === void 0 ? {} : _a, builder = _b.builder, id = _b.id;
        return isEmpty(builder) ? {} : { builder: builder, builderField: builder.getFieldById(id) };
    };
    Action.prototype.execute = function (action, props, event) {
        if (event === void 0) { event = void (0); }
        var otherEvent = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEvent[_i - 3] = arguments[_i];
        }
        var name = action.name, handler = action.handler, stop = action.stop;
        var e = this.createEvent(event, otherEvent);
        if (stop && !isEmpty(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        return name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
    };
    Action.prototype.invoke = function (actions, props, event) {
        var _this = this;
        if (event === void 0) { event = void (0); }
        var otherEvent = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEvent[_i - 3] = arguments[_i];
        }
        var _actions = (Array.isArray(actions) ? actions : [actions]).map(serializeAction);
        return toForkJoin(_actions.map(function (_a) {
            var before = _a.before;
            return before && _this.invoke.apply(_this, __spreadArray([before, props, event], otherEvent, false));
        })).pipe(observableMap(function () { return forkJoin(_actions.map(function (action) {
            return _this.execute.apply(_this, __spreadArray([action, props, event], otherEvent, false));
        })); }), observableTap(function (result) { return !props ? of(void (0)) : toForkJoin(_actions.map(function (action, index) {
            var _a, _b;
            var callLink = _this.createCallLinkType(action, props, event, result[index]);
            return action.type && ((_b = (_a = props.builder) === null || _a === void 0 ? void 0 : _a.$$cache.eventHook) === null || _b === void 0 ? void 0 : _b.invokeCalculators.apply(_b, __spreadArray([action, props, callLink, result[index]], otherEvent, false)));
        })); }), observableTap(function (result) { return toForkJoin(_actions.map(function (_a, index) {
            var after = _a.after;
            return after && _this.invoke.apply(_this, __spreadArray([after, props, result[index]], otherEvent, false));
        })); }), map(function (result) { return result.pop(); }));
    };
    Action.prototype.callAction = function (actionName, context) {
        var events = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            events[_i - 2] = arguments[_i];
        }
        return this.invoke.apply(this, __spreadArray([serializeAction(actionName), context], events, false));
    };
    Action.prototype.executeAction = function (actionProps, actionContext, _a) {
        var _b = _a === void 0 ? this.createEvent(void (0)) : _a, actionEvent = _b[0], otherEvent = _b.slice(1);
        var _c = serializeAction(actionProps), _d = _c.name, name = _d === void 0 ? "" : _d, handler = _c.handler;
        var _e = name.match(/([^.]+)/ig) || [name], actionName = _e[0], _f = _e[1], execute = _f === void 0 ? 'execute' : _f;
        var ActionType = null;
        var executeHandler = handler;
        var action = new BaseAction().invoke(__assign(__assign({}, actionContext), { actionProps: actionProps, actionEvent: actionEvent }));
        var builder = action.builder;
        action.injector = (builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector;
        if (!executeHandler && builder) {
            executeHandler = builder.getExecuteHandler(name, false);
        }
        if (!executeHandler && (ActionType = this.getType(ACTIONS_CONFIG, actionName))) {
            action = this.getCacheAction(ActionType, action);
            executeHandler = funcToObservable(this.mp.proxyMethodAsync(action, execute));
        }
        if (!executeHandler) {
            throw new Error("".concat(name, " not defined!"));
        }
        return transformObservable(executeHandler.apply(undefined, __spreadArray([
            actionEvent instanceof EventZip ? actionEvent.event : action
        ], otherEvent, true)));
    };
    Action = __decorate([
        __param(0, Inject(MethodProxy)),
        __param(1, Inject(Injector)),
        __param(2, Inject(GET_TYPE)),
        __metadata("design:paramtypes", [MethodProxy,
            Injector, Object])
    ], Action);
    return Action;
}());
export { Action };

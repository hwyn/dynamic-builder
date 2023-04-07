import { __assign, __decorate, __metadata, __param, __spreadArray } from "tslib";
import { Inject, InjectFlags, Injector } from '@fm/di';
import { groupBy, isEmpty, toArray } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG, GET_TYPE } from '../../token';
import { observableMap, observableTap, toForkJoin, transformObservable } from '../../utility';
import { serializeAction } from '../basic/basic.extension';
import { BaseAction } from './base.action';
var Action = /** @class */ (function () {
    function Action(injector, getType) {
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
            cacheType = injector.get(ActionType, InjectFlags.NonCache).invoke(context);
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
    Action.prototype.getActionContext = function (_a) {
        var _b = _a === void 0 ? {} : _a, builder = _b.builder, id = _b.id;
        return isEmpty(builder) ? {} : { builder: builder, builderField: builder.getFieldById(id) };
    };
    Action.prototype.call = function (calculators, builder, callLink) {
        var _this = this;
        if (callLink === void 0) { callLink = []; }
        var groupList = toArray(groupBy(calculators, 'targetId'));
        return function (value) {
            var other = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                other[_i - 1] = arguments[_i];
            }
            return forkJoin(groupList.map(function (links) {
                return _this.invoke.apply(_this, __spreadArray([links.map(function (_a) {
                        var action = _a.action;
                        return (__assign(__assign({}, action), { callLink: callLink }));
                    }), { builder: builder, id: links[0].targetId }, value], other, false));
            }));
        };
    };
    Action.prototype.invokeCallCalculators = function (calculators, _a, props) {
        var type = _a.type, callLink = _a.callLink;
        var builder = props.builder, id = props.id;
        var filterCalculators = calculators.filter(function (_a) {
            var _b = _a.dependent, fieldId = _b.fieldId, cType = _b.type;
            return fieldId === id && cType === type;
        });
        var link = __spreadArray(__spreadArray([], (callLink || []), true), [{ fieldId: id, type: type, count: filterCalculators.length }], false);
        return !isEmpty(filterCalculators) ? this.call(filterCalculators, builder, link) : function (value) { return of(value); };
    };
    Action.prototype.invokeCalculators = function (actionProps, props, value) {
        var _this = this;
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
        var builder = props.builder, id = props.id;
        var nonSelfBuilders = (builder === null || builder === void 0 ? void 0 : builder.$$cache.nonSelfBuilders) || [];
        var calculatorsInvokes = nonSelfBuilders.map(function (nonBuild) {
            return _this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id: id });
        });
        calculatorsInvokes.push(this.invokeCallCalculators((builder === null || builder === void 0 ? void 0 : builder.calculators) || [], actionProps, props));
        return forkJoin(calculatorsInvokes.map(function (invokeCalculators) { return invokeCalculators.apply(void 0, __spreadArray([value], otherEventParam, false)); }));
    };
    Action.prototype.execute = function (action, props, event) {
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
        var name = action.name, handler = action.handler, stop = action.stop;
        var e = this.createEvent(event, otherEventParam);
        if (stop && !isEmpty(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        return name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
    };
    Action.prototype.invoke = function (actions, props, event) {
        var _this = this;
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
        var _actions = (Array.isArray(actions) ? actions : [actions]).map(serializeAction);
        return toForkJoin(_actions.map(function (_a) {
            var before = _a.before;
            return before && _this.invoke.apply(_this, __spreadArray([before, props, event], otherEventParam, false));
        })).pipe(observableMap(function () { return forkJoin(_actions.map(function (action) {
            return _this.execute.apply(_this, __spreadArray([action, props, event], otherEventParam, false));
        })); }), observableTap(function (result) { return !props ? of(null) : toForkJoin(_actions.map(function (action, index) {
            return action.type && _this.invokeCalculators.apply(_this, __spreadArray([action, props, result[index]], otherEventParam, false));
        })); }), observableTap(function (result) { return toForkJoin(_actions.map(function (_a, index) {
            var after = _a.after;
            return after && _this.invoke.apply(_this, __spreadArray([after, props, typeof result[index] === 'undefined' ? event : result[index]], otherEventParam, false));
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
            while (builder) {
                executeHandler = builder.getExecuteHandler(name) || executeHandler;
                builder = builder.parent;
            }
        }
        if (!executeHandler && (ActionType = this.getType(ACTIONS_CONFIG, actionName))) {
            action = this.getCacheAction(ActionType, action);
            executeHandler = action[execute].bind(action);
        }
        if (!executeHandler) {
            throw new Error("".concat(name, " not defined!"));
        }
        return transformObservable(executeHandler.apply(undefined, __spreadArray([action], otherEvent, true)));
    };
    Action = __decorate([
        __param(0, Inject(Injector)),
        __param(1, Inject(GET_TYPE)),
        __metadata("design:paramtypes", [Injector, Object])
    ], Action);
    return Action;
}());
export { Action };

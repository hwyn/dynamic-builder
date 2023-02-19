import { __assign, __decorate, __metadata, __param, __rest, __spreadArray } from "tslib";
/* eslint-disable max-lines-per-function */
import { Inject, Injector } from '@fm/di';
import { flatMap, groupBy, isEmpty, toArray } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG } from '../../token';
<<<<<<< HEAD
import { observableMap, observableTap, toForkJoin, transformObservable } from '../../utility';
=======
import { observableMap, observableTap, transformObservable } from '../../utility';
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
import { serializeAction } from '../basic/basic.extension';
import { BaseAction } from './base.action';
var Action = /** @class */ (function () {
    function Action(injector, actions) {
        this.injector = injector;
        this.actions = flatMap(actions);
    }
    Action.prototype.getAction = function (name) {
        var _a = this.actions.filter(function (_a) {
            var actionName = _a.name;
            return actionName === name;
        })[0], _b = _a === void 0 ? {} : _a, _c = _b.action, action = _c === void 0 ? null : _c;
        return action;
    };
    Action.prototype.getCacheAction = function (ActionType, context, baseAction) {
        var _a;
        var builder = baseAction.builder, _uid = baseAction.actionPropos._uid, builderField = baseAction.builderField;
        var _b = (builderField || {}).cacheAction, cacheAction = _b === void 0 ? [] : _b;
        var cacheType = (_a = cacheAction.find(function (_a) {
            var uid = _a.uid;
            return _uid === uid;
        })) === null || _a === void 0 ? void 0 : _a.action;
        if (!cacheType) {
            cacheType = new ActionType((builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector, context);
            if (!ActionType.cache || !builderField || !_uid)
                return cacheType;
        }
        cacheType.context = context;
        builderField.cacheAction && cacheAction.push({ uid: _uid, action: cacheType });
        return cacheType;
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
        var nonSelfBuilders = builder.$$cache.nonSelfBuilders || [];
        var calculatorsInvokes = nonSelfBuilders.map(function (nonBuild) {
            return _this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id: id });
        });
        calculatorsInvokes.push(this.invokeCallCalculators(builder.calculators || [], actionProps, props));
        return forkJoin(calculatorsInvokes.map(function (invokeCalculators) { return invokeCalculators.apply(void 0, __spreadArray([value], otherEventParam, false)); }));
    };
    Action.prototype.execute = function (action, props, event) {
<<<<<<< HEAD
=======
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
        var name = action.name, handler = action.handler, stop = action.stop, type = action.type;
        if (stop && !isEmpty(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        var e = this.createEvent(event, otherEventParam);
        var actionSub = name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
        var hasInvokeCalculators = !!props && action && type;
        return hasInvokeCalculators ? this.invokeCalculators(action, actionSub, props) : actionSub;
    };
    Action.prototype.invokeAction = function (action, props, event) {
        var _this = this;
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
<<<<<<< HEAD
        var name = action.name, handler = action.handler, stop = action.stop;
        var e = this.createEvent(event, otherEventParam);
        if (stop && !isEmpty(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        return name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
=======
        var before = action.before, after = action.after, current = __rest(action, ["before", "after"]);
        var execute = function () { return _this.execute.apply(_this, __spreadArray([current, props, event], otherEventParam, false)); };
        var actionSub = before ? this.invoke.apply(this, __spreadArray([before, props, event], otherEventParam, false)).pipe(observableMap(function () { return execute(); })) : execute();
        if (after) {
            actionSub = actionSub.pipe(observableTap(function (value) {
                return _this.invoke.apply(_this, __spreadArray([after, props, typeof value === 'undefined' ? event : value], otherEventParam, false));
            }));
        }
        return actionSub;
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
    };
    Action.prototype.invoke = function (actions, props, event) {
        var _this = this;
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
<<<<<<< HEAD
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
=======
        var actionsSub;
        if (Array.isArray(actions)) {
            actionsSub = forkJoin((actions).map(function (a) { return _this.invokeAction.apply(_this, __spreadArray([serializeAction(a), props, event], otherEventParam, false)); })).pipe(map(function (result) { return result.pop(); }));
        }
        else {
            actionsSub = this.invokeAction.apply(this, __spreadArray([serializeAction(actions), props, event], otherEventParam, false));
        }
        return actionsSub;
    };
    Action.prototype.callAction = function (actionName, context) {
        var events = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            events[_i - 2] = arguments[_i];
        }
        return this.invoke.apply(this, __spreadArray([serializeAction(actionName), context], events, false));
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
    };
    Action.prototype.callAction = function (actionName, context) {
        var events = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            events[_i - 2] = arguments[_i];
        }
        return this.invoke.apply(this, __spreadArray([serializeAction(actionName), context], events, false));
    };
    Action.prototype.executeAction = function (actionPropos, actionContext, _a) {
        var _b = _a === void 0 ? this.createEvent(void (0)) : _a, actionEvent = _b[0], otherEvent = _b.slice(1);
        var _c = serializeAction(actionPropos), _d = _c.name, name = _d === void 0 ? "" : _d, handler = _c.handler;
        var _e = name.match(/([^.]+)/ig) || [name], actionName = _e[0], _f = _e[1], execute = _f === void 0 ? 'execute' : _f;
        var context = __assign(__assign({}, actionContext), { actionPropos: actionPropos, actionEvent: actionEvent });
        var ActionType = null;
        var executeHandler = handler;
        var action = new BaseAction(this.injector, context);
        var builder = action.builder;
<<<<<<< HEAD
        if (!executeHandler && (ActionType = this.getAction(actionName))) {
            action = this.getCacheAction(ActionType, context, action);
=======
        var ActionType = null;
        if (!executeHandler && (ActionType = this.getAction(actionName))) {
            action = ActionType && new ActionType(this.injector, context);
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
            executeHandler = action && action[execute].bind(action);
        }
        if (!executeHandler && builder) {
            while (builder) {
                executeHandler = builder.getExecuteHandler(name) || executeHandler;
                builder = builder.parent;
            }
        }
        if (!executeHandler) {
            throw new Error("".concat(name, " not defined!"));
        }
        return transformObservable(executeHandler.apply(undefined, __spreadArray([action], otherEvent, true)));
    };
    Action = __decorate([
        __param(0, Inject(Injector)),
        __param(1, Inject(ACTIONS_CONFIG)),
        __metadata("design:paramtypes", [Injector, Array])
    ], Action);
    return Action;
}());
export { Action };

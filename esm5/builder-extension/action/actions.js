import { __assign, __decorate, __metadata, __param, __rest, __spreadArray } from "tslib";
/* eslint-disable max-lines-per-function */
import { Inject, Injector } from '@fm/di';
import { flatMap, isEmpty } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG } from '../../token';
import { observableMap, observableTap, transformObservable } from '../../utility';
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
        return function (value) { return forkJoin(calculators.map(function (_a) {
            var id = _a.targetId, action = _a.action;
            return _this.invoke(__assign(__assign({}, action), { callLink: callLink }), { builder: builder, id: id }, value);
        })); };
    };
    Action.prototype.invokeCallCalculators = function (calculators, _a, props) {
        var type = _a.type, callLink = _a.callLink;
        var builder = props.builder, id = props.id;
        var link = __spreadArray(__spreadArray([], callLink || [], true), [{ fieldId: id, type: type }], false);
        var filterCalculators = calculators.filter(function (_a) {
            var _b = _a.dependent, fieldId = _b.fieldId, cType = _b.type;
            return fieldId === id && cType === type;
        });
        return !isEmpty(filterCalculators) ? this.call(filterCalculators, builder, link) : function (value) { return of(value); };
    };
    Action.prototype.invokeCalculators = function (actionProps, actionSub, props) {
        var _this = this;
        var builder = props.builder, id = props.id;
        var calculators = builder.calculators;
        var nonSelfBuilders = builder.$$cache.nonSelfBuilders || [];
        var calculatorsInvokes = nonSelfBuilders.map(function (nonBuild) {
            return _this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id: id });
        });
        calculatorsInvokes.push(this.invokeCallCalculators(calculators || [], actionProps, props));
        return actionSub.pipe(observableTap(function (value) { return forkJoin(calculatorsInvokes.map(function (invokeCalculators) { return invokeCalculators(value); })); }));
    };
    Action.prototype.execute = function (action, props, event) {
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
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
        var before = action.before, after = action.after, current = __rest(action, ["before", "after"]);
        var execute = function () { return _this.execute.apply(_this, __spreadArray([current, props, event], otherEventParam, false)); };
        var actionSub = before ? this.invoke(before, props, event, otherEventParam).pipe(observableMap(function () { return execute(); })) : execute();
        if (after) {
            actionSub = actionSub.pipe(observableTap(function (value) {
                return _this.invoke.apply(_this, __spreadArray([after, props, typeof value === 'undefined' ? event : value], otherEventParam, false));
            }));
        }
        return actionSub;
    };
    Action.prototype.invoke = function (actions, props, event) {
        var _this = this;
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
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
    };
    // eslint-disable-next-line complexity
    Action.prototype.executeAction = function (actionPropos, actionContext, event) {
        if (event === void 0) { event = this.createEvent(void (0)); }
        var actionEvent = event[0], otherEvent = event.slice(1);
        var _a = serializeAction(actionPropos), _b = _a.name, name = _b === void 0 ? "" : _b, handler = _a.handler;
        var _c = name.match(/([^.]+)/ig) || [name], actionName = _c[0], _d = _c[1], execute = _d === void 0 ? 'execute' : _d;
        var context = __assign(__assign({}, actionContext), { actionPropos: actionPropos, actionEvent: actionEvent });
        var action = new BaseAction(this.injector, context);
        var executeHandler = handler;
        var builder = action.builder;
        var ActionType = null;
        if (!executeHandler && (ActionType = this.getAction(actionName))) {
            action = ActionType && new ActionType(this.injector, context);
            executeHandler = action && action[execute].bind(action);
        }
        if (!executeHandler && builder) {
            while (builder) {
                executeHandler = builder.getExecuteHandler(name) || executeHandler;
                if (builder === builder.root) {
                    break;
                }
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

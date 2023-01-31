"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var tslib_1 = require("tslib");
/* eslint-disable max-lines-per-function */
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var token_1 = require("../../token");
var utility_1 = require("../../utility");
var basic_extension_1 = require("../basic/basic.extension");
var base_action_1 = require("./base.action");
var Action = /** @class */ (function () {
    function Action(injector, actions) {
        this.injector = injector;
        this.actions = (0, lodash_1.flatMap)(actions);
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
        return tslib_1.__spreadArray([event], otherEventParam, true);
    };
    Action.prototype.getActionContext = function (_a) {
        var _b = _a === void 0 ? {} : _a, builder = _b.builder, id = _b.id;
        return (0, lodash_1.isEmpty)(builder) ? {} : { builder: builder, builderField: builder.getFieldById(id) };
    };
    Action.prototype.call = function (calculators, builder, callLink) {
        var _this = this;
        if (callLink === void 0) { callLink = []; }
        return function (value) { return (0, rxjs_1.forkJoin)(calculators.map(function (_a) {
            var id = _a.targetId, action = _a.action;
            return _this.invoke(tslib_1.__assign(tslib_1.__assign({}, action), { callLink: callLink }), { builder: builder, id: id }, value);
        })); };
    };
    Action.prototype.invokeCallCalculators = function (calculators, _a, props) {
        var type = _a.type, callLink = _a.callLink;
        var builder = props.builder, id = props.id;
        var link = tslib_1.__spreadArray(tslib_1.__spreadArray([], callLink || [], true), [{ fieldId: id, type: type }], false);
        var filterCalculators = calculators.filter(function (_a) {
            var _b = _a.dependent, fieldId = _b.fieldId, cType = _b.type;
            return fieldId === id && cType === type;
        });
        return !(0, lodash_1.isEmpty)(filterCalculators) ? this.call(filterCalculators, builder, link) : function (value) { return (0, rxjs_1.of)(value); };
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
        return actionSub.pipe((0, utility_1.observableTap)(function (value) { return (0, rxjs_1.forkJoin)(calculatorsInvokes.map(function (invokeCalculators) { return invokeCalculators(value); })); }));
    };
    Action.prototype.execute = function (action, props, event) {
        if (event === void 0) { event = null; }
        var otherEventParam = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEventParam[_i - 3] = arguments[_i];
        }
        var name = action.name, handler = action.handler, stop = action.stop, type = action.type;
        if (stop && !(0, lodash_1.isEmpty)(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        var e = this.createEvent(event, otherEventParam);
        var actionSub = name || handler ? this.executeAction(action, this.getActionContext(props), e) : (0, rxjs_1.of)(event);
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
        var before = action.before, after = action.after, current = tslib_1.__rest(action, ["before", "after"]);
        var execute = function () { return _this.execute.apply(_this, tslib_1.__spreadArray([current, props, event], otherEventParam, false)); };
        var actionSub = before ? this.invoke(before, props, event, otherEventParam).pipe((0, utility_1.observableMap)(function () { return execute(); })) : execute();
        if (after) {
            actionSub = actionSub.pipe((0, utility_1.observableTap)(function (value) {
                return _this.invoke.apply(_this, tslib_1.__spreadArray([after, props, typeof value === 'undefined' ? event : value], otherEventParam, false));
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
            actionsSub = (0, rxjs_1.forkJoin)((actions).map(function (a) { return _this.invokeAction.apply(_this, tslib_1.__spreadArray([(0, basic_extension_1.serializeAction)(a), props, event], otherEventParam, false)); })).pipe((0, operators_1.map)(function (result) { return result.pop(); }));
        }
        else {
            actionsSub = this.invokeAction.apply(this, tslib_1.__spreadArray([(0, basic_extension_1.serializeAction)(actions), props, event], otherEventParam, false));
        }
        return actionsSub;
    };
    Action.prototype.callAction = function (actionName, context) {
        var events = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            events[_i - 2] = arguments[_i];
        }
        return this.invoke.apply(this, tslib_1.__spreadArray([(0, basic_extension_1.serializeAction)(actionName), context], events, false));
    };
    // eslint-disable-next-line complexity
    Action.prototype.executeAction = function (actionPropos, actionContext, event) {
        if (event === void 0) { event = this.createEvent(void (0)); }
        var actionEvent = event[0], otherEvent = event.slice(1);
        var _a = (0, basic_extension_1.serializeAction)(actionPropos), _b = _a.name, name = _b === void 0 ? "" : _b, handler = _a.handler;
        var _c = name.match(/([^.]+)/ig) || [name], actionName = _c[0], _d = _c[1], execute = _d === void 0 ? 'execute' : _d;
        var context = tslib_1.__assign(tslib_1.__assign({}, actionContext), { actionPropos: actionPropos, actionEvent: actionEvent });
        var action = new base_action_1.BaseAction(this.injector, context);
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
        return (0, utility_1.transformObservable)(executeHandler.apply(undefined, tslib_1.__spreadArray([action], otherEvent, true)));
    };
    Action = tslib_1.__decorate([
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__param(1, (0, di_1.Inject)(token_1.ACTIONS_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector, Array])
    ], Action);
    return Action;
}());
exports.Action = Action;

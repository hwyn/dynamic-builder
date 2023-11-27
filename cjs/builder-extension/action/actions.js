"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var token_1 = require("../../token");
var utility_1 = require("../../utility");
var basic_extension_1 = require("../basic/basic.extension");
var base_action_1 = require("./base.action");
var event_zip_1 = require("./event-zip");
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
        return tslib_1.__spreadArray([event], otherEventParam, true);
    };
    Action.prototype.createCallLinkType = function (_a, _b, input, out) {
        var type = _a.type, _c = _a.callLink, callLink = _c === void 0 ? [] : _c;
        var id = _b.id;
        return tslib_1.__spreadArray(tslib_1.__spreadArray([], callLink, true), [{ fieldId: id, type: type, input: input, out: out }], false);
    };
    Action.prototype.getActionContext = function (_a) {
        var _b = _a === void 0 ? {} : _a, builder = _b.builder, id = _b.id;
        return (0, lodash_1.isEmpty)(builder) ? {} : { builder: builder, builderField: builder.getFieldById(id) };
    };
    Action.prototype.call = function (calculators, builder) {
        var _this = this;
        var groupList = (0, lodash_1.toArray)((0, lodash_1.groupBy)(calculators, 'targetId'));
        return function (callLink, value) {
            var other = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                other[_i - 2] = arguments[_i];
            }
            return (0, rxjs_1.forkJoin)(groupList.map(function (links) {
                return _this.invoke.apply(_this, tslib_1.__spreadArray([links.map(function (_a) {
                        var action = _a.action;
                        return (tslib_1.__assign(tslib_1.__assign({}, action), { callLink: callLink }));
                    }), { builder: builder, id: links[0].targetId }, value], other, false));
            }));
        };
    };
    Action.prototype.invokeCallCalculators = function (calculators, _a, props) {
        var type = _a.type;
        var builder = props.builder, id = props.id;
        var filterCalculators = calculators.filter(function (_a) {
            var _b = _a.dependent, fieldId = _b.fieldId, cType = _b.type;
            return fieldId === id && cType === type;
        });
        return !(0, lodash_1.isEmpty)(filterCalculators) ? this.call(filterCalculators, builder) : function (_callLink, value) { return (0, rxjs_1.of)(value); };
    };
    Action.prototype.invokeCalculators = function (actionProps, props, callLink) {
        var _this = this;
        var events = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            events[_i - 3] = arguments[_i];
        }
        var builder = props.builder, id = props.id;
        var value = events[0], otherEvent = events.slice(1);
        var nonSelfBuilders = (builder === null || builder === void 0 ? void 0 : builder.$$cache.nonSelfBuilders) || [];
        var calculatorsInvokes = nonSelfBuilders.map(function (nonBuild) {
            return _this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id: id });
        });
        calculatorsInvokes.push(this.invokeCallCalculators((builder === null || builder === void 0 ? void 0 : builder.calculators) || [], actionProps, props));
        return (0, rxjs_1.forkJoin)(calculatorsInvokes.map(function (invokeCalculators) { return invokeCalculators.apply(void 0, tslib_1.__spreadArray([callLink, value], otherEvent, false)); }));
    };
    Action.prototype.execute = function (action, props, event) {
        if (event === void 0) { event = void (0); }
        var otherEvent = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEvent[_i - 3] = arguments[_i];
        }
        var name = action.name, handler = action.handler, stop = action.stop;
        var e = this.createEvent(event, otherEvent);
        if (stop && !(0, lodash_1.isEmpty)(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        return name || handler ? this.executeAction(action, this.getActionContext(props), e) : (0, rxjs_1.of)(event);
    };
    Action.prototype.invoke = function (actions, props, event) {
        var _this = this;
        if (event === void 0) { event = void (0); }
        var otherEvent = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            otherEvent[_i - 3] = arguments[_i];
        }
        var _actions = (Array.isArray(actions) ? actions : [actions]).map(basic_extension_1.serializeAction);
        return (0, utility_1.toForkJoin)(_actions.map(function (_a) {
            var before = _a.before;
            return before && _this.invoke.apply(_this, tslib_1.__spreadArray([before, props, event], otherEvent, false));
        })).pipe((0, utility_1.observableMap)(function () { return (0, rxjs_1.forkJoin)(_actions.map(function (action) {
            return _this.execute.apply(_this, tslib_1.__spreadArray([action, props, event], otherEvent, false));
        })); }), (0, utility_1.observableTap)(function (result) { return !props ? (0, rxjs_1.of)(void (0)) : (0, utility_1.toForkJoin)(_actions.map(function (action, index) {
            var callLink = _this.createCallLinkType(action, props, event, result[index]);
            return action.type && _this.invokeCalculators.apply(_this, tslib_1.__spreadArray([action, props, callLink, result[index]], otherEvent, false));
        })); }), (0, utility_1.observableTap)(function (result) { return (0, utility_1.toForkJoin)(_actions.map(function (_a, index) {
            var after = _a.after;
            return after && _this.invoke.apply(_this, tslib_1.__spreadArray([after, props, result[index]], otherEvent, false));
        })); }), (0, operators_1.map)(function (result) { return result.pop(); }));
    };
    Action.prototype.callAction = function (actionName, context) {
        var events = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            events[_i - 2] = arguments[_i];
        }
        return this.invoke.apply(this, tslib_1.__spreadArray([(0, basic_extension_1.serializeAction)(actionName), context], events, false));
    };
    Action.prototype.executeAction = function (actionProps, actionContext, _a) {
        var _b = _a === void 0 ? this.createEvent(void (0)) : _a, actionEvent = _b[0], otherEvent = _b.slice(1);
        var _c = (0, basic_extension_1.serializeAction)(actionProps), _d = _c.name, name = _d === void 0 ? "" : _d, handler = _c.handler;
        var _e = name.match(/([^.]+)/ig) || [name], actionName = _e[0], _f = _e[1], execute = _f === void 0 ? 'execute' : _f;
        var ActionType = null;
        var executeHandler = handler;
        var action = new base_action_1.BaseAction().invoke(tslib_1.__assign(tslib_1.__assign({}, actionContext), { actionProps: actionProps, actionEvent: actionEvent }));
        var builder = action.builder;
        action.injector = (builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector;
        if (!executeHandler && builder) {
            executeHandler = builder.getExecuteHandler(name, false);
        }
        if (!executeHandler && (ActionType = this.getType(token_1.ACTIONS_CONFIG, actionName))) {
            action = this.getCacheAction(ActionType, action);
            executeHandler = (0, utility_1.funcToObservable)(this.mp.proxyMethodAsync(action, execute));
        }
        if (!executeHandler) {
            throw new Error("".concat(name, " not defined!"));
        }
        return (0, utility_1.transformObservable)(executeHandler.apply(undefined, tslib_1.__spreadArray([
            actionEvent instanceof event_zip_1.EventZip ? actionEvent.event : action
        ], otherEvent, true)));
    };
    Action = tslib_1.__decorate([
        tslib_1.__param(0, (0, di_1.Inject)(di_1.MethodProxy)),
        tslib_1.__param(1, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__param(2, (0, di_1.Inject)(token_1.GET_TYPE)),
        tslib_1.__metadata("design:paramtypes", [di_1.MethodProxy,
            di_1.Injector, Object])
    ], Action);
    return Action;
}());
exports.Action = Action;

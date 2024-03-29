"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHook = void 0;
var tslib_1 = require("tslib");
/* eslint-disable max-len */
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var token_1 = require("../../token");
var basic_utility_1 = require("../basic-utility/basic-utility");
var calculator_constant_1 = require("../constant/calculator.constant");
var EventHook = /** @class */ (function (_super) {
    tslib_1.__extends(EventHook, _super);
    function EventHook(builder, props, cache, json) {
        var _this = _super.call(this, builder, props, cache, json) || this;
        _this.calculators = [];
        _this.nonSelfCalculators = [];
        _this.actionIntercept = _this.injector.get(token_1.ACTION_INTERCEPT);
        _this.cache.bindFn.push(function () { return _this.destroy(); });
        _this.defineProperty(_this.cache, calculator_constant_1.NON_SELF_BUILDERS, _this.builder.root.$$cache.nonSelfBuilders || []);
        return _this;
    }
    EventHook.create = function (builder, props, cache, json) {
        return new EventHook(builder, props, cache, json);
    };
    EventHook.prototype.linkCalculators = function () {
        var _this = this;
        var calculators = this.serializeCalculators();
        calculators.forEach(function (calculator) { return _this.linkCalculator(calculator); });
        this.getNonSelfCalculators().forEach(function (calculator) { return _this.linkCalculator(calculator, true); });
        this.calculators = calculators.filter(function (c) { return !_this.nonSelfCalculators.includes(c); });
        this.pushNonBuilders();
    };
    EventHook.prototype.invokeCalculators = function (actionProps, props, callLink) {
        var _this = this;
        var events = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            events[_i - 3] = arguments[_i];
        }
        var value = events[0], otherEvent = events.slice(1);
        var nonSelfBuilders = this.nonSelfBuilders || [];
        var calculatorsInvokes = nonSelfBuilders.map(function (nonBuild) { var _a, _b; return _this.invokeCallCalculators((_b = (_a = _this.getEventHook(nonBuild)) === null || _a === void 0 ? void 0 : _a.nonSelfCalculators) !== null && _b !== void 0 ? _b : [], actionProps, props, { builder: nonBuild, id: props.id }); });
        calculatorsInvokes.push(this.invokeCallCalculators(this.calculators || [], actionProps, props, props));
        return (0, rxjs_1.forkJoin)(calculatorsInvokes.map(function (invokeCalculators) { return invokeCalculators.apply(void 0, tslib_1.__spreadArray([callLink, value], otherEvent, false)); }));
    };
    EventHook.prototype.serializeCalculators = function () {
        var _this = this;
        var fields = tslib_1.__spreadArray(tslib_1.__spreadArray([], this.jsonFields, true), [this.json], false);
        var fieldsWithCalculators = fields.filter(function (_a) {
            var calculators = _a.calculators;
            return !(0, lodash_1.isEmpty)(calculators);
        });
        var originCalculators = [];
        this.cache.fields.forEach(function (_a) {
            var field = _a.field;
            return delete field.calculators;
        });
        fieldsWithCalculators.forEach(function (_a) {
            var targetId = _a.id, _b = _a.calculators, calculators = _b === void 0 ? [] : _b;
            _this.toArray(calculators).forEach(function (_a) {
                var action = _a.action, dependents = _a.dependents;
                _this.toArray(action).forEach(function (a) {
                    _this.toArray(dependents).forEach(function (dependent) {
                        originCalculators.push({ targetId: targetId, action: _this.serializeAction(a), dependent: dependent });
                    });
                });
            });
        });
        return originCalculators;
    };
    EventHook.prototype.linkCalculator = function (calculator, nonSelfCalculator) {
        var _a = calculator.dependent, type = _a.type, fieldId = _a.fieldId, nonSelf = _a.nonSelf;
        var sourceField = this.getJsonFieldById(fieldId) || this.json;
        sourceField.actions = this.toArray(sourceField.actions || []);
        var _b = sourceField.actions, actions = _b === void 0 ? [] : _b, sourceId = sourceField.id;
        var nonCalculator = fieldId !== sourceId || nonSelf;
        if (nonCalculator && !nonSelfCalculator) {
            this.nonSelfCalculators.push(calculator);
            this.linkOtherCalculator(calculator);
        }
        if (!nonCalculator && sourceField !== this.json && !actions.some(function (action) { return action.type === type; })) {
            actions.unshift({ type: type });
        }
    };
    EventHook.prototype.linkOtherCalculator = function (calculator) {
        var _this = this;
        var _a = calculator.dependent, type = _a.type, _b = _a.fieldId, fieldId = _b === void 0 ? '' : _b;
        var dependentFields = this.builder.root.getAllFieldById(fieldId).filter(function (_a) {
            var field = _a.field, _b = _a.events, events = _b === void 0 ? {} : _b;
            return _this.isBuildField(field) ? !_this.cache.lifeType.includes(type) : !events[_this.getEventType(type)];
        });
        if (!(0, lodash_1.isEmpty)(dependentFields)) {
            dependentFields.forEach(function (dependentField) { return dependentField.addEventListener && dependentField.addEventListener({ type: type }); });
        }
    };
    EventHook.prototype.call = function (calculators, builder) {
        var groupList = (0, lodash_1.toArray)((0, lodash_1.groupBy)(calculators, 'targetId'));
        var inter = this.actionIntercept;
        return function (callLink, value) {
            var other = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                other[_i - 2] = arguments[_i];
            }
            return (0, rxjs_1.forkJoin)(groupList.map(function (links) {
                return inter.invoke.apply(inter, tslib_1.__spreadArray([links.map(function (_a) {
                        var action = _a.action;
                        return (tslib_1.__assign(tslib_1.__assign({}, action), { callLink: callLink }));
                    }), { builder: builder, id: links[0].targetId }, value], other, false));
            }));
        };
    };
    EventHook.prototype.invokeCallCalculators = function (calculators, _a, targetProps, props) {
        var type = _a.type;
        var builder = props.builder, id = props.id;
        var filterCalculators = calculators.filter(function (calculator) {
            var _a = calculator.dependent, fieldId = _a.fieldId, cType = _a.type, equal = _a.equal;
            return fieldId === id && cType === type && (!equal || equal(targetProps, calculator));
        });
        return !(0, lodash_1.isEmpty)(filterCalculators) ? this.call(filterCalculators, builder) : function (_callLink, value) { return (0, rxjs_1.of)(value); };
    };
    EventHook.prototype.getEventHook = function (builder) {
        var _a;
        return (_a = builder.$$cache) === null || _a === void 0 ? void 0 : _a.eventHook;
    };
    EventHook.prototype.getNonSelfCalculators = function () {
        var _this = this;
        return (0, lodash_1.flatMap)(this.nonSelfBuilders.map(function (nonSelf) { var _a; return (_a = _this.getEventHook(nonSelf).nonSelfCalculators) !== null && _a !== void 0 ? _a : []; }));
    };
    EventHook.prototype.pushNonBuilders = function () {
        if (this.nonSelfCalculators.length && this.nonSelfBuilders.indexOf(this.builder) === -1) {
            this.nonSelfBuilders.push(this.builder);
        }
    };
    Object.defineProperty(EventHook.prototype, "nonSelfBuilders", {
        get: function () {
            return this.cache.nonSelfBuilders;
        },
        enumerable: false,
        configurable: true
    });
    EventHook.prototype.destroy = function () {
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        tslib_1.__spreadArray(tslib_1.__spreadArray([], this.jsonFields, true), [this.json], false).forEach(function (item) { return delete item.calculators; });
        this.unDefineProperty(this, ['calculators', 'nonSelfCalculators']);
        this.unDefineProperty(this.cache, [calculator_constant_1.NON_SELF_BUILDERS]);
    };
    return EventHook;
}(basic_utility_1.BasicUtility));
exports.EventHook = EventHook;

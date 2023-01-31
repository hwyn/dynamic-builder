"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicExtension = exports.serializeAction = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var utility_1 = require("../../utility");
var create_actions_1 = require("../action/create-actions");
var calculator_constant_1 = require("../constant/calculator.constant");
var serializeAction = function (action) {
    return ((0, lodash_1.isString)(action) ? { name: action } : (0, lodash_1.isFunction)(action) ? { handler: action } : action);
};
exports.serializeAction = serializeAction;
var BasicExtension = /** @class */ (function () {
    function BasicExtension(builder, props, cache, json) {
        var _a;
        this.builder = builder;
        this.props = props;
        this.cache = cache;
        this.json = json;
        this.injector = this.builder.injector;
        this.jsonFields = (_a = this.json) === null || _a === void 0 ? void 0 : _a.fields;
    }
    BasicExtension.prototype.afterExtension = function () { };
    BasicExtension.prototype.beforeDestory = function () { };
    BasicExtension.prototype.destory = function () { };
    BasicExtension.prototype.init = function () {
        return (0, utility_1.transformObj)(this.extension(), this);
    };
    BasicExtension.prototype.afterInit = function () {
        var _this = this;
        return (0, utility_1.transformObj)(this.afterExtension(), function () { return (0, utility_1.transformObj)(_this.beforeDestory(), function () { return _this.destory(); }); });
    };
    BasicExtension.prototype.eachFields = function (jsonFields, callBack) {
        var _this = this;
        jsonFields.forEach(function (jsonField) { return callBack([jsonField, _this.getBuilderFieldById(jsonField.id)]); });
    };
    BasicExtension.prototype.mapFields = function (jsonFields, callBack) {
        var _this = this;
        return jsonFields.map(function (jsonField) {
            var builderField = _this.getBuilderFieldById(jsonField.id);
            return callBack([jsonField, builderField]) || builderField;
        });
    };
    BasicExtension.prototype.serializeCalculatorConfig = function (jsonCalculator, actionType, defaultDependents) {
        var needSerialize = (0, lodash_1.isString)(jsonCalculator) || (0, lodash_1.isFunction)(jsonCalculator);
        var calculatorConfig = needSerialize ? { action: this.serializeAction(jsonCalculator) } : (0, lodash_1.cloneDeep)(jsonCalculator);
        var action = calculatorConfig.action, _a = calculatorConfig.dependents, dependents = _a === void 0 ? defaultDependents : _a;
        calculatorConfig.action = (0, lodash_1.merge)({ type: actionType }, this.serializeAction(action));
        calculatorConfig.dependents = dependents;
        return calculatorConfig;
    };
    BasicExtension.prototype.bindCalculatorAction = function (handler) {
        var action = this.serializeAction(handler);
        action.type = calculator_constant_1.CALCULATOR;
        return action;
    };
    BasicExtension.prototype.pushCalculators = function (fieldConfig, calculator) {
        fieldConfig.calculators = this.toArray(fieldConfig.calculators || []);
        var _a = fieldConfig.calculators, calculators = _a === void 0 ? [] : _a;
        calculators.push.apply(calculators, this.toArray(calculator));
        fieldConfig.calculators = calculators;
    };
    BasicExtension.prototype.pushAction = function (fieldConfig, actions) {
        fieldConfig.actions = this.toArray(fieldConfig.actions || []);
        var defaultAction = fieldConfig.actions;
        this.toArray(actions).forEach(function (pushAction) {
            var findAction = defaultAction.find(function (_a) {
                var defaultType = _a.type;
                return pushAction.type === defaultType;
            });
            !findAction ? defaultAction.push(pushAction) : Object.assign(findAction, tslib_1.__assign({}, pushAction));
        });
    };
    BasicExtension.prototype.pushActionToMethod = function (actions) {
        var _this = this;
        var props = { builder: this.builder, id: this.builder.id };
        var _actions = this.toArray(actions).map(this.serializeAction);
        var events = this.createActions(_actions, props, { injector: this.injector });
        _actions.forEach(function (action) { return _this.defineProperty(_this.builder, action.type, events[_this.getEventType(action.type)]); });
    };
    BasicExtension.prototype.toArray = function (obj) {
        return Array.isArray(obj) ? obj : [obj];
    };
    BasicExtension.prototype.defineProperty = function (object, prototypeName, value) {
        Object.defineProperty(object, prototypeName, (0, utility_1.withValue)(value));
    };
    BasicExtension.prototype.definePropertys = function (object, prototype) {
        var _this = this;
        Object.keys(prototype).forEach(function (key) { return _this.defineProperty(object, key, prototype[key]); });
    };
    BasicExtension.prototype.definePropertyGet = function (object, prototypeName, get) {
        Object.defineProperty(object, prototypeName, (0, utility_1.withGetOrSet)(get));
    };
    BasicExtension.prototype.unDefineProperty = function (object, prototypeNames) {
        var _this = this;
        prototypeNames.forEach(function (prototypeName) { return _this.defineProperty(object, prototypeName, null); });
    };
    BasicExtension.prototype.serializeAction = function (action) {
        return (0, exports.serializeAction)(action);
    };
    BasicExtension.prototype.createActions = function (actions, props, options) {
        return (0, create_actions_1.createActions)(actions, props, options);
    };
    BasicExtension.prototype.getEventType = function (type) {
        return (0, create_actions_1.getEventType)(type);
    };
    BasicExtension.prototype.getJsonFieldById = function (fieldId) {
        return this.jsonFields.find(function (_a) {
            var id = _a.id;
            return fieldId === id;
        });
    };
    BasicExtension.prototype.getBuilderFieldById = function (fieldId) {
        return this.builder.getFieldById(fieldId);
    };
    return BasicExtension;
}());
exports.BasicExtension = BasicExtension;

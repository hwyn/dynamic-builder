import { __assign } from "tslib";
import { cloneDeep, isFunction, isString, merge } from 'lodash';
import { transformObj, withGetOrSet, withValue } from '../../utility';
import { createActions, getEventType } from '../action/create-actions';
import { CALCULATOR } from '../constant/calculator.constant';
export var serializeAction = function (action) {
    return (isString(action) ? { name: action } : isFunction(action) ? { handler: action } : action);
};
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
        return transformObj(this.extension(), this);
    };
    BasicExtension.prototype.afterInit = function () {
        var _this = this;
        return transformObj(this.afterExtension(), function () { return transformObj(_this.beforeDestory(), function () { return _this.destory(); }); });
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
        var needSerialize = isString(jsonCalculator) || isFunction(jsonCalculator);
        var calculatorConfig = needSerialize ? { action: this.serializeAction(jsonCalculator) } : cloneDeep(jsonCalculator);
        var action = calculatorConfig.action, _a = calculatorConfig.dependents, dependents = _a === void 0 ? defaultDependents : _a;
        calculatorConfig.action = merge({ type: actionType }, this.serializeAction(action));
        calculatorConfig.dependents = dependents;
        return calculatorConfig;
    };
    BasicExtension.prototype.bindCalculatorAction = function (handler) {
        var action = this.serializeAction(handler);
        action.type = CALCULATOR;
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
            !findAction ? defaultAction.push(pushAction) : Object.assign(findAction, __assign({}, pushAction));
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
        Object.defineProperty(object, prototypeName, withValue(value));
    };
    BasicExtension.prototype.definePropertys = function (object, prototype) {
        var _this = this;
        Object.keys(prototype).forEach(function (key) { return _this.defineProperty(object, key, prototype[key]); });
    };
    BasicExtension.prototype.definePropertyGet = function (object, prototypeName, get) {
        Object.defineProperty(object, prototypeName, withGetOrSet(get));
    };
    BasicExtension.prototype.unDefineProperty = function (object, prototypeNames) {
        var _this = this;
        prototypeNames.forEach(function (prototypeName) { return _this.defineProperty(object, prototypeName, null); });
    };
    BasicExtension.prototype.serializeAction = function (action) {
        return serializeAction(action);
    };
    BasicExtension.prototype.createActions = function (actions, props, options) {
        return createActions(actions, props, options);
    };
    BasicExtension.prototype.getEventType = function (type) {
        return getEventType(type);
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
export { BasicExtension };

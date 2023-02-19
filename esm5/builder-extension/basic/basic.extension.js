import { isFunction, isString, merge } from 'lodash';
import { cloneDeepPlain, generateUUID, transformObj, withGetOrSet, withValue } from '../../utility';
import { createActions, getActionType, getEventType } from '../action/create-actions';
import { CALCULATOR } from '../constant/calculator.constant';
export var serializeAction = function (action) {
    var sAction = (isString(action) ? { name: action } : isFunction(action) ? { handler: action } : action);
    sAction && !sAction._uid && (sAction._uid = generateUUID(5));
    return sAction;
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
        this.beforeExtension();
    }
    BasicExtension.prototype.beforeExtension = function () { };
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
    BasicExtension.prototype.isBuildField = function (props) {
        return ['jsonName', 'configAction', 'jsonNameAction', 'config'].some(function (key) { return !!props[key]; });
    };
    BasicExtension.prototype.cloneDeepPlain = function (value) {
        return cloneDeepPlain(value);
    };
    BasicExtension.prototype.serializeCalculatorConfig = function (jsonCalculator, actionType, defaultDependents) {
        var needSerialize = isString(jsonCalculator) || isFunction(jsonCalculator);
        var calculatorConfig = needSerialize ? { action: this.serializeAction(jsonCalculator) } : this.cloneDeepPlain(jsonCalculator);
        var action = calculatorConfig.action, _a = calculatorConfig.dependents, dependents = _a === void 0 ? defaultDependents : _a;
        calculatorConfig.action = merge({ type: actionType }, this.serializeAction(action));
        calculatorConfig.dependents = dependents;
        return calculatorConfig;
    };
    BasicExtension.prototype.bindCalculatorAction = function (handler) {
        var action = this.serializeAction(handler);
        action.type = CALCULATOR;
        this.cache.bindFn.push(function () { return delete action.handler; });
        return action;
    };
    BasicExtension.prototype.pushCalculators = function (fieldConfig, calculator) {
        var _a;
        fieldConfig.calculators = this.toArray(fieldConfig.calculators || []);
        (_a = fieldConfig.calculators).push.apply(_a, this.toArray(calculator));
    };
    BasicExtension.prototype.pushAction = function (fieldConfig, actions) {
        fieldConfig.actions = this.toArray(fieldConfig.actions || []);
        var defaultAction = fieldConfig.actions;
        this.toArray(actions).forEach(function (pushAction) {
            var findAction = defaultAction.find(function (_a) {
                var defaultType = _a.type;
                return pushAction.type === defaultType;
            });
            !findAction ? defaultAction.push(pushAction) : Object.assign(findAction, pushAction);
        });
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
    BasicExtension.prototype.pushActionToMethod = function (actions) {
        var _this = this;
        var events = this.createLifeActions(actions);
        this.toArray(actions).forEach(function (_a) {
            var type = _a.type;
            return _this.defineProperty(_this.builder, type, events[_this.getEventType(type)]);
        });
    };
    BasicExtension.prototype.createLifeActionEvents = function (actions) {
        var _this = this;
        var events = this.createLifeActions(actions);
        return this.toArray(actions).map(function (_a) {
            var type = _a.type;
            return events[_this.getEventType(type)];
        });
    };
    BasicExtension.prototype.createLifeActions = function (actions) {
        var _this = this;
        this.cache.lifeType = this.toArray(this.cache.lifeType || []);
        var lifeType = this.cache.lifeType;
        var props = { builder: this.builder, id: this.builder.id };
        var _actions = this.toArray(actions).map(function (action) {
            !lifeType.includes(action.type) && lifeType.push(action.type);
            return _this.serializeAction(action);
        });
        return this.createActions(_actions, props, { injector: this.injector });
    };
    BasicExtension.prototype.createActions = function (actions, props, options) {
        return createActions(actions, props, options);
    };
    BasicExtension.prototype.getEventType = function (type) {
        return getEventType(type);
    };
    BasicExtension.prototype.getActionType = function (type) {
        return getActionType(type);
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

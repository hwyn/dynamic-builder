import { __extends } from "tslib";
import { isFunction, isString, merge } from 'lodash';
import { cloneDeepPlain, transformObj, withGetOrSet } from '../../utility/utility';
import { createActions } from '../action/create-actions';
import { BasicUtility } from '../basic-utility/basic-utility';
import { CALCULATOR } from '../constant/calculator.constant';
var BasicExtension = /** @class */ (function (_super) {
    __extends(BasicExtension, _super);
    function BasicExtension(builder, props, cache, json) {
        var _this = _super.call(this, builder, props, cache, json) || this;
        _this.beforeExtension();
        return _this;
    }
    BasicExtension.prototype.beforeExtension = function () { };
    BasicExtension.prototype.afterExtension = function () { };
    BasicExtension.prototype.beforeDestroy = function () { };
    BasicExtension.prototype.destroy = function () { };
    BasicExtension.prototype.init = function () {
        return transformObj(this.extension(), this);
    };
    BasicExtension.prototype.afterInit = function () {
        var _this = this;
        return transformObj(this.afterExtension(), function () { return transformObj(_this.beforeDestroy(), function () { return _this.destroy(); }); });
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
    BasicExtension.prototype.cloneDeepPlain = function (value) {
        return cloneDeepPlain(value);
    };
    BasicExtension.prototype.serializeCalculatorConfig = function (jsonCalculator, actionType, defaultDependents) {
        var needSerialize = isString(jsonCalculator) || isFunction(jsonCalculator);
        var calculatorConfig = needSerialize ? { action: jsonCalculator } : this.cloneDeepPlain(jsonCalculator);
        var action = calculatorConfig.action, _a = calculatorConfig.dependents, dependents = _a === void 0 ? defaultDependents : _a;
        calculatorConfig.action = merge({ type: actionType }, this.serializeAction(action));
        calculatorConfig.dependents = dependents;
        return calculatorConfig;
    };
    BasicExtension.prototype.bindCalculatorAction = function (handler, type) {
        var _this = this;
        if (type === void 0) { type = CALCULATOR; }
        var action = this.serializeAction(handler);
        action.type = type;
        if (!this.cache.bindActionHandler) {
            this.cache.bindActionHandler = this.factoryBindFn(function (item) { return _this.removeAction(item); });
        }
        action.handler && this.cache.bindActionHandler(action);
        return action;
    };
    BasicExtension.prototype.pushCalculators = function (fieldConfig, calculator) {
        var _a;
        fieldConfig.calculators = this.toArray(fieldConfig.calculators || []);
        var pushCalculators = this.toArray(calculator);
        (_a = fieldConfig.calculators).push.apply(_a, pushCalculators);
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
    BasicExtension.prototype.defineProperties = function (object, prototype) {
        var _this = this;
        Object.keys(prototype).forEach(function (key) { return _this.defineProperty(object, key, prototype[key]); });
    };
    BasicExtension.prototype.definePropertyGet = function (object, prototypeName, get) {
        Object.defineProperty(object, prototypeName, withGetOrSet(get));
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
        if (!this.cache.bindAction) {
            this.cache.bindAction = this.factoryBindFn(function (item) { return delete item.builder; });
        }
        this.cache.bindAction(props);
        return createActions(actions, props, options);
    };
    BasicExtension.prototype.getBuilderFieldById = function (fieldId) {
        return this.builder.getFieldById(fieldId);
    };
    return BasicExtension;
}(BasicUtility));
export { BasicExtension };

import { isFunction, isString, merge } from 'lodash';
import { cloneDeepPlain, transformObj, withGetOrSet } from '../../utility/utility';
import { createActions } from '../action/create-actions';
import { BasicUtility } from '../basic-utility/basic-utility';
import { CALCULATOR } from '../constant/calculator.constant';
export class BasicExtension extends BasicUtility {
    constructor(builder, props, cache, json) {
        super(builder, props, cache, json);
        this.beforeExtension();
    }
    beforeExtension() { }
    afterExtension() { }
    beforeDestroy() { }
    destroy() { }
    init() {
        return transformObj(this.extension(), this);
    }
    afterInit() {
        return transformObj(this.afterExtension(), () => transformObj(this.beforeDestroy(), () => this.destroy()));
    }
    eachFields(jsonFields, callBack) {
        jsonFields.forEach((jsonField) => callBack([jsonField, this.getBuilderFieldById(jsonField.id)]));
    }
    mapFields(jsonFields, callBack) {
        return jsonFields.map((jsonField) => {
            const builderField = this.getBuilderFieldById(jsonField.id);
            return callBack([jsonField, builderField]) || builderField;
        });
    }
    cloneDeepPlain(value) {
        return cloneDeepPlain(value);
    }
    serializeCalculatorConfig(jsonCalculator, actionType, defaultDependents) {
        const needSerialize = isString(jsonCalculator) || isFunction(jsonCalculator);
        const calculatorConfig = needSerialize ? { action: jsonCalculator } : this.cloneDeepPlain(jsonCalculator);
        const { action, dependents = defaultDependents } = calculatorConfig;
        calculatorConfig.action = merge({ type: actionType }, this.serializeAction(action));
        calculatorConfig.dependents = dependents;
        return calculatorConfig;
    }
    bindCalculatorAction(handler, type = CALCULATOR) {
        const action = this.serializeAction(handler);
        action.type = type;
        action.handler && this.cache.bindFn.push(function () { delete action.handler; });
        return action;
    }
    pushCalculators(fieldConfig, calculator) {
        fieldConfig.calculators = this.toArray(fieldConfig.calculators || []);
        const pushCalculators = this.toArray(calculator);
        fieldConfig.calculators.push(...pushCalculators);
    }
    pushAction(fieldConfig, actions) {
        fieldConfig.actions = this.toArray(fieldConfig.actions || []);
        const { actions: defaultAction } = fieldConfig;
        this.toArray(actions).forEach((pushAction) => {
            const findAction = defaultAction.find(({ type: defaultType }) => pushAction.type === defaultType);
            !findAction ? defaultAction.push(pushAction) : Object.assign(findAction, pushAction);
        });
    }
    defineProperties(object, prototype) {
        Object.keys(prototype).forEach((key) => this.defineProperty(object, key, prototype[key]));
    }
    definePropertyGet(object, prototypeName, get) {
        Object.defineProperty(object, prototypeName, withGetOrSet(get));
    }
    pushActionToMethod(actions) {
        const events = this.createLifeActions(actions);
        this.toArray(actions).forEach(({ type }) => this.defineProperty(this.builder, type, events[this.getEventType(type)]));
    }
    createLifeActionEvents(actions) {
        const events = this.createLifeActions(actions);
        return this.toArray(actions).map(({ type }) => events[this.getEventType(type)]);
    }
    createLifeActions(actions) {
        this.cache.lifeType = this.toArray(this.cache.lifeType || []);
        const { lifeType } = this.cache;
        const props = { builder: this.builder, id: this.builder.id };
        const _actions = this.toArray(actions).map((action) => {
            !lifeType.includes(action.type) && lifeType.push(action.type);
            return this.serializeAction(action);
        });
        return this.createActions(_actions, props, { injector: this.injector });
    }
    createActions(actions, props, options) {
        return createActions(actions, props, options);
    }
    getBuilderFieldById(fieldId) {
        return this.builder.getFieldById(fieldId);
    }
}

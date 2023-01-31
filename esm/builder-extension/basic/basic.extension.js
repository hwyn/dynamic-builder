import { cloneDeep, isFunction, isString, merge } from 'lodash';
import { transformObj, withGetOrSet, withValue } from '../../utility';
import { createActions, getEventType } from '../action/create-actions';
import { CALCULATOR } from '../constant/calculator.constant';
export const serializeAction = (action) => {
    return (isString(action) ? { name: action } : isFunction(action) ? { handler: action } : action);
};
export class BasicExtension {
    constructor(builder, props, cache, json) {
        var _a;
        this.builder = builder;
        this.props = props;
        this.cache = cache;
        this.json = json;
        this.injector = this.builder.injector;
        this.jsonFields = (_a = this.json) === null || _a === void 0 ? void 0 : _a.fields;
    }
    afterExtension() { }
    beforeDestory() { }
    destory() { }
    init() {
        return transformObj(this.extension(), this);
    }
    afterInit() {
        return transformObj(this.afterExtension(), () => transformObj(this.beforeDestory(), () => this.destory()));
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
    serializeCalculatorConfig(jsonCalculator, actionType, defaultDependents) {
        const needSerialize = isString(jsonCalculator) || isFunction(jsonCalculator);
        const calculatorConfig = needSerialize ? { action: this.serializeAction(jsonCalculator) } : cloneDeep(jsonCalculator);
        const { action, dependents = defaultDependents } = calculatorConfig;
        calculatorConfig.action = merge({ type: actionType }, this.serializeAction(action));
        calculatorConfig.dependents = dependents;
        return calculatorConfig;
    }
    bindCalculatorAction(handler) {
        const action = this.serializeAction(handler);
        action.type = CALCULATOR;
        return action;
    }
    pushCalculators(fieldConfig, calculator) {
        fieldConfig.calculators = this.toArray(fieldConfig.calculators || []);
        const { calculators = [] } = fieldConfig;
        calculators.push(...this.toArray(calculator));
        fieldConfig.calculators = calculators;
    }
    pushAction(fieldConfig, actions) {
        fieldConfig.actions = this.toArray(fieldConfig.actions || []);
        const { actions: defaultAction } = fieldConfig;
        this.toArray(actions).forEach((pushAction) => {
            const findAction = defaultAction.find(({ type: defaultType }) => pushAction.type === defaultType);
            !findAction ? defaultAction.push(pushAction) : Object.assign(findAction, Object.assign({}, pushAction));
        });
    }
    pushActionToMethod(actions) {
        const props = { builder: this.builder, id: this.builder.id };
        const _actions = this.toArray(actions).map(this.serializeAction);
        const events = this.createActions(_actions, props, { injector: this.injector });
        _actions.forEach((action) => this.defineProperty(this.builder, action.type, events[this.getEventType(action.type)]));
    }
    toArray(obj) {
        return Array.isArray(obj) ? obj : [obj];
    }
    defineProperty(object, prototypeName, value) {
        Object.defineProperty(object, prototypeName, withValue(value));
    }
    definePropertys(object, prototype) {
        Object.keys(prototype).forEach((key) => this.defineProperty(object, key, prototype[key]));
    }
    definePropertyGet(object, prototypeName, get) {
        Object.defineProperty(object, prototypeName, withGetOrSet(get));
    }
    unDefineProperty(object, prototypeNames) {
        prototypeNames.forEach((prototypeName) => this.defineProperty(object, prototypeName, null));
    }
    serializeAction(action) {
        return serializeAction(action);
    }
    createActions(actions, props, options) {
        return createActions(actions, props, options);
    }
    getEventType(type) {
        return getEventType(type);
    }
    getJsonFieldById(fieldId) {
        return this.jsonFields.find(({ id }) => fieldId === id);
    }
    getBuilderFieldById(fieldId) {
        return this.builder.getFieldById(fieldId);
    }
}

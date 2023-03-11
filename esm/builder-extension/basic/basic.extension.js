import { isFunction, isString, merge } from 'lodash';
import { cloneDeepPlain, generateUUID, transformObj, withGetOrSet, withValue } from '../../utility';
import { createActions, getActionType, getEventType } from '../action/create-actions';
import { CALCULATOR } from '../constant/calculator.constant';
export const serializeAction = (action) => {
    const sAction = (isString(action) ? { name: action } : isFunction(action) ? { handler: action } : action);
    sAction && !sAction._uid && (sAction._uid = generateUUID(5));
    return sAction;
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
        this.beforeExtension();
    }
    get builderAttr() {
        return ['jsonName', 'configAction', 'jsonNameAction', 'config'];
    }
    beforeExtension() { }
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
    isBuildField(props) {
        return this.builderAttr.some((key) => !!props[key]);
    }
    cloneDeepPlain(value) {
        return cloneDeepPlain(value);
    }
    serializeCalculatorConfig(jsonCalculator, actionType, defaultDependents) {
        const needSerialize = isString(jsonCalculator) || isFunction(jsonCalculator);
        const calculatorConfig = needSerialize ? { action: this.serializeAction(jsonCalculator) } : this.cloneDeepPlain(jsonCalculator);
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
        this.cache.bindFn.push(function () {
            pushCalculators.forEach((c) => fieldConfig.calculators.splice(fieldConfig.calculators.indexOf(c), 1));
        });
    }
    pushAction(fieldConfig, actions) {
        fieldConfig.actions = this.toArray(fieldConfig.actions || []);
        const { actions: defaultAction } = fieldConfig;
        this.toArray(actions).forEach((pushAction) => {
            const findAction = defaultAction.find(({ type: defaultType }) => pushAction.type === defaultType);
            !findAction ? defaultAction.push(pushAction) : Object.assign(findAction, pushAction);
        });
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
    getEventType(type) {
        return getEventType(type);
    }
    getActionType(type) {
        return getActionType(type);
    }
    getJsonFieldById(fieldId) {
        return this.jsonFields.find(({ id }) => fieldId === id);
    }
    getBuilderFieldById(fieldId) {
        return this.builder.getFieldById(fieldId);
    }
}

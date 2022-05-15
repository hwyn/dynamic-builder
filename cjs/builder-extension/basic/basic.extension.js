"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicExtension = exports.serializeAction = void 0;
const lodash_1 = require("lodash");
const utility_1 = require("../../utility");
const create_actions_1 = require("../action/create-actions");
const serializeAction = (action) => {
    return ((0, lodash_1.isString)(action) ? { name: action } : (0, lodash_1.isFunction)(action) ? { handler: action } : action);
};
exports.serializeAction = serializeAction;
class BasicExtension {
    builder;
    props;
    cache;
    json;
    jsonFields;
    ls;
    constructor(builder, props, cache, json) {
        this.builder = builder;
        this.props = props;
        this.cache = cache;
        this.json = json;
        this.ls = this.builder.ls;
        this.jsonFields = this.json?.fields;
    }
    afterExtension() { }
    beforeDestory() { }
    destory() { }
    init() {
        return (0, utility_1.transformObj)(this.extension(), this);
    }
    afterInit() {
        return (0, utility_1.transformObj)(this.afterExtension(), () => (0, utility_1.transformObj)(this.beforeDestory(), () => this.destory()));
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
        const needSerialize = (0, lodash_1.isString)(jsonCalculator) || (0, lodash_1.isFunction)(jsonCalculator);
        const calculatorConfig = needSerialize ? { action: this.serializeAction(jsonCalculator) } : (0, lodash_1.cloneDeep)(jsonCalculator);
        const { action, dependents = defaultDependents } = calculatorConfig;
        calculatorConfig.action = (0, lodash_1.merge)({ type: actionType }, this.serializeAction(action));
        calculatorConfig.dependents = dependents;
        return calculatorConfig;
    }
    bindCalculatorAction(handler) {
        return { type: 'calculator', handler };
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
            !findAction ? defaultAction.push(pushAction) : Object.assign(findAction, { ...pushAction });
        });
    }
    toArray(obj) {
        return Array.isArray(obj) ? obj : [obj];
    }
    defineProperty(object, prototypeName, value) {
        Object.defineProperty(object, prototypeName, (0, utility_1.withValue)(value));
    }
    definePropertys(object, prototype) {
        Object.keys(prototype).forEach((key) => this.defineProperty(object, key, prototype[key]));
    }
    definePropertyGet(object, prototypeName, get) {
        Object.defineProperty(object, prototypeName, (0, utility_1.withGetOrSet)(get));
    }
    unDefineProperty(object, prototypeNames) {
        prototypeNames.forEach((prototypeName) => this.defineProperty(object, prototypeName, null));
    }
    serializeAction(action) {
        return (0, exports.serializeAction)(action);
    }
    createActions(actions, props, options) {
        return (0, create_actions_1.createActions)(actions, props, options);
    }
    getEventType(type) {
        return (0, create_actions_1.getEventType)(type);
    }
    getJsonFieldById(fieldId) {
        return this.jsonFields.find(({ id }) => fieldId === id);
    }
    getBuilderFieldById(fieldId) {
        return this.builder.getFieldById(fieldId);
    }
}
exports.BasicExtension = BasicExtension;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleExtension = void 0;
const lodash_1 = require("lodash");
const import_rxjs_1 = require("@fm/import-rxjs");
const import_rxjs_2 = require("@fm/import-rxjs");
const utility_1 = require("../../utility");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
class LifeCycleExtension extends basic_extension_1.BasicExtension {
    hasChange = false;
    calculators = [];
    nonSelfCalculators = [];
    lifeActions;
    detectChanges = this.cache.detectChanges.pipe((0, import_rxjs_2.filter)(() => !this.hasChange));
    extension() {
        const nonSelfBuilders = this.builder.root.$$cache.nonSelfBuilders;
        this.defineProperty(this.cache, calculator_constant_1.NON_SELF_BUILSERS, nonSelfBuilders || []);
    }
    afterExtension() {
        this.serializeCalculators();
        return this.createLife();
    }
    createLife() {
        const { actions = [] } = this.json;
        const lifeEvent = [calculator_constant_1.LOAD, calculator_constant_1.CHANGE];
        const lifeActionsType = actions.filter(({ type }) => lifeEvent.includes(type));
        const props = { builder: this.builder, id: this.builder.id };
        lifeActionsType.forEach((action) => action.runObservable = true);
        this.lifeActions = this.createActions(lifeActionsType, props, { ls: this.ls });
        this.defineProperty(this.builder, this.getEventType(calculator_constant_1.CHANGE), this.onLifeChange.bind(this));
        return this.invokeLifeCycle(this.getEventType(calculator_constant_1.LOAD), this.props);
    }
    onLifeChange(props) {
        this.hasChange = true;
        this.invokeLifeCycle(this.getEventType(calculator_constant_1.CHANGE), props).subscribe();
        this.hasChange = false;
    }
    invokeLifeCycle(type, event, otherEvent) {
        const lifeActions = this.lifeActions;
        return lifeActions[type] ? lifeActions[type](event, otherEvent) : (0, import_rxjs_1.of)(event);
    }
    serializeCalculators() {
        this.createCalculators();
        this.linkCalculators();
        this.bindCalculator();
    }
    linkCalculators() {
        this.calculators.forEach((calculator) => this.linkCalculator(calculator));
        this.getNonSelfCalculators().forEach((calculator) => this.linkCalculator(calculator, true));
    }
    linkCalculator(calculator, nonSelfCalculator) {
        const { type, fieldId } = calculator.dependent;
        const sourceField = this.getJsonFieldById(fieldId) || this.json;
        sourceField.actions = this.toArray(sourceField.actions || []);
        const { actions = [], id: sourceId } = sourceField;
        const nonSource = fieldId !== sourceId;
        if (nonSource && !nonSelfCalculator) {
            this.nonSelfCalculators.push(calculator);
            this.linkOtherCalculator(calculator);
        }
        if (!nonSource && !actions.some((action) => action.type === type)) {
            sourceField.actions = [{ type }, ...actions];
        }
    }
    linkOtherCalculator(calculator) {
        const { type, fieldId = '' } = calculator.dependent;
        const otherFields = this.builder.root.getAllFieldById(fieldId);
        if (!(0, lodash_1.isEmpty)(otherFields)) {
            otherFields.forEach((otherField) => otherField.addEventListener({ type }));
        }
    }
    createCalculators() {
        const fields = [...this.jsonFields, this.json];
        const fieldsCalculators = (0, lodash_1.cloneDeep)(fields.filter(({ calculators }) => !(0, lodash_1.isEmpty)(calculators)));
        this.calculators = [];
        fieldsCalculators.forEach(({ id: targetId, calculators = [] }) => {
            this.toArray(calculators).forEach(({ action, dependents }) => {
                this.toArray(dependents).forEach((dependent) => {
                    this.calculators.push({ targetId, action: this.serializeAction(action), dependent });
                });
            });
            delete this.getBuilderFieldById(targetId)?.field.calculators;
        });
    }
    getNonSelfCalculators() {
        return (0, lodash_1.flatMap)(this.nonSelfBuilders.map((nonSelf) => nonSelf.nonSelfCalculators));
    }
    get nonSelfBuilders() {
        return this.cache.nonSelfBuilders;
    }
    bindCalculator() {
        this.builder.calculators = this.calculators;
        this.builder.nonSelfCalculators = this.nonSelfCalculators;
        this.defineProperty(this.cache, calculator_constant_1.ORIGIN_CALCULATORS, this.calculators);
        this.defineProperty(this.cache, calculator_constant_1.ORIGIN_NON_SELF_CALCULATORS, this.nonSelfCalculators);
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.push(this.builder);
        }
    }
    beforeDestory() {
        return this.invokeLifeCycle(this.getEventType(calculator_constant_1.DESTORY)).pipe((0, utility_1.observableMap)(() => (0, utility_1.transformObservable)(super.beforeDestory())));
    }
    destory() {
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        this.unDefineProperty(this.builder, ['calculators', 'nonSelfCalculators', this.getEventType(calculator_constant_1.CHANGE)]);
        this.unDefineProperty(this.cache, [calculator_constant_1.ORIGIN_CALCULATORS, calculator_constant_1.ORIGIN_NON_SELF_CALCULATORS, calculator_constant_1.NON_SELF_BUILSERS]);
        this.unDefineProperty(this, ['detectChanges', 'lifeActions']);
        const parentField = this.builder.parent?.getFieldById(this.builder.id);
        return (0, utility_1.transformObservable)(super.destory()).pipe((0, import_rxjs_2.tap)(() => parentField && parentField.instance?.destory.next(this.builder.id)));
    }
}
exports.LifeCycleExtension = LifeCycleExtension;

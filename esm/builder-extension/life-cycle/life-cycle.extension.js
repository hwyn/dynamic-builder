import { cloneDeep, flatMap, isEmpty } from 'lodash';
import { of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { observableMap, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, DESTORY, LOAD, NON_SELF_BUILSERS, ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS } from '../constant/calculator.constant';
export class LifeCycleExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.hasChange = false;
        this.calculators = [];
        this.nonSelfCalculators = [];
        this.detectChanges = this.cache.detectChanges.pipe(filter(() => !this.hasChange));
    }
    extension() {
        const nonSelfBuilders = this.builder.root.$$cache.nonSelfBuilders;
        this.defineProperty(this.cache, NON_SELF_BUILSERS, nonSelfBuilders || []);
    }
    afterExtension() {
        this.serializeCalculators();
        return this.createLife();
    }
    createLife() {
        const { actions = [] } = this.json;
        const lifeEvent = [LOAD, CHANGE];
        const lifeActionsType = actions.filter(({ type }) => lifeEvent.includes(type));
        const props = { builder: this.builder, id: this.builder.id };
        lifeActionsType.forEach((action) => action.runObservable = true);
        this.lifeActions = this.createActions(lifeActionsType, props, { injector: this.injector });
        this.defineProperty(this.builder, this.getEventType(CHANGE), this.onLifeChange.bind(this));
        return this.invokeLifeCycle(this.getEventType(LOAD), this.props);
    }
    onLifeChange(props) {
        this.hasChange = true;
        this.invokeLifeCycle(this.getEventType(CHANGE), props).subscribe();
        this.hasChange = false;
    }
    invokeLifeCycle(type, event, otherEvent) {
        const lifeActions = this.lifeActions;
        return lifeActions[type] ? lifeActions[type](event, otherEvent) : of(event);
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
            sourceField.actions.unshift({ type });
        }
    }
    linkOtherCalculator(calculator) {
        const { type, fieldId = '' } = calculator.dependent;
        const otherFields = this.builder.root.getAllFieldById(fieldId);
        if (!isEmpty(otherFields)) {
            otherFields.forEach((otherField) => otherField.addEventListener({ type }));
        }
    }
    createCalculators() {
        const fields = [...this.jsonFields, this.json];
        const fieldsCalculators = cloneDeep(fields.filter(({ calculators }) => !isEmpty(calculators)));
        this.calculators = [];
        fieldsCalculators.forEach(({ id: targetId, calculators = [] }) => {
            var _a;
            this.toArray(calculators).forEach(({ action, dependents }) => {
                this.toArray(dependents).forEach((dependent) => {
                    this.calculators.push({ targetId, action: this.serializeAction(action), dependent });
                });
            });
            (_a = this.getBuilderFieldById(targetId)) === null || _a === void 0 ? true : delete _a.field.calculators;
        });
    }
    getNonSelfCalculators() {
        return flatMap(this.nonSelfBuilders.map((nonSelf) => nonSelf.nonSelfCalculators));
    }
    get nonSelfBuilders() {
        return this.cache.nonSelfBuilders;
    }
    bindCalculator() {
        this.builder.calculators = this.calculators;
        this.builder.nonSelfCalculators = this.nonSelfCalculators;
        this.defineProperty(this.cache, ORIGIN_CALCULATORS, this.calculators);
        this.defineProperty(this.cache, ORIGIN_NON_SELF_CALCULATORS, this.nonSelfCalculators);
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.push(this.builder);
        }
    }
    beforeDestory() {
        return this.invokeLifeCycle(this.getEventType(DESTORY)).pipe(observableMap(() => transformObservable(super.beforeDestory())));
    }
    destory() {
        var _a;
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        this.unDefineProperty(this.builder, ['calculators', 'nonSelfCalculators', this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, [ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS, NON_SELF_BUILSERS]);
        this.unDefineProperty(this, ['detectChanges', 'lifeActions']);
        const parentField = (_a = this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(this.builder.id);
        return transformObservable(super.destory()).pipe(tap(() => { var _a; return parentField && ((_a = parentField.instance) === null || _a === void 0 ? void 0 : _a.destory.next(this.builder.id)); }));
    }
}

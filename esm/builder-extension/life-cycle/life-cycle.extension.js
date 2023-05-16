import { flatMap, isEmpty } from 'lodash';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { observableMap, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
// eslint-disable-next-line max-len
import { CHANGE, DESTROY, LOAD, LOAD_SOURCE, NON_SELF_BUILDERS, ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS } from '../constant/calculator.constant';
export class LifeCycleExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.hasChange = false;
        this.lifeEvent = [LOAD, CHANGE, DESTROY];
        this.calculators = [];
        this.nonSelfCalculators = [];
    }
    extension() {
        const nonSelfBuilders = this.builder.root.$$cache.nonSelfBuilders;
        this.defineProperty(this.cache, NON_SELF_BUILDERS, nonSelfBuilders || []);
    }
    afterExtension() {
        this.serializeCalculators();
        return this.createLife();
    }
    createLoadAction(json) {
        const { actions = [] } = json;
        const loadIndex = actions.findIndex(({ type }) => type === LOAD);
        const loadAction = { before: Object.assign(Object.assign({}, actions[loadIndex]), { type: LOAD_SOURCE }), type: LOAD };
        loadIndex === -1 ? actions.push(loadAction) : actions[loadIndex] = loadAction;
        return json;
    }
    createLife() {
        const { actions } = this.createLoadAction(this.json);
        const lifeActionsType = actions.filter(({ type }) => this.lifeEvent.includes(type));
        lifeActionsType.forEach((action) => action.runObservable = true);
        this.lifeActions = this.createLifeActions(lifeActionsType);
        this.defineProperty(this.builder, this.getEventType(CHANGE), this.onLifeChange.bind(this, this.builder.onChange));
        return this.invokeLifeCycle(this.getEventType(LOAD), this.props);
    }
    onLifeChange(onChange, props) {
        this.invokeLifeCycle(this.getEventType(CHANGE), props).pipe(tap(() => onChange.call(this.builder, props))).subscribe();
    }
    invokeLifeCycle(type, event, otherEvent) {
        return this.lifeActions[type] ? this.lifeActions[type](event, otherEvent) : of(event);
    }
    serializeCalculators() {
        this.createCalculators();
        this.linkCalculators();
        this.bindCalculator();
    }
    linkCalculators() {
        this.cache.lifeType = [...this.lifeEvent, ...this.cache.lifeType || []];
        this.calculators.forEach((calculator) => this.linkCalculator(calculator));
        this.getNonSelfCalculators().forEach((calculator) => this.linkCalculator(calculator, true));
        this.calculators = this.calculators.filter((c) => !this.nonSelfCalculators.includes(c));
    }
    linkCalculator(calculator, nonSelfCalculator) {
        const { type, fieldId } = calculator.dependent;
        const sourceField = this.getJsonFieldById(fieldId) || this.json;
        sourceField.actions = this.toArray(sourceField.actions || []);
        const { actions = [], id: sourceId } = sourceField;
        const isBuildCalculator = this.isBuildField(sourceField) && this.cache.lifeType.includes(type);
        const nonCalculator = isBuildCalculator || fieldId !== sourceId;
        if (nonCalculator && !nonSelfCalculator) {
            this.nonSelfCalculators.push(calculator);
            !isBuildCalculator && this.linkOtherCalculator(calculator);
        }
        if (!nonCalculator && !actions.some((action) => action.type === type)) {
            actions.unshift({ type });
        }
    }
    linkOtherCalculator(calculator) {
        const { type, fieldId = '' } = calculator.dependent;
        const dependentFields = this.builder.root.getAllFieldById(fieldId);
        if (!isEmpty(dependentFields)) {
            dependentFields.forEach((dependentField) => dependentField.addEventListener && dependentField.addEventListener({ type }));
        }
    }
    createCalculators() {
        const fields = [...this.jsonFields, this.json];
        const fieldsWithCalculators = fields.filter(({ calculators }) => !isEmpty(calculators));
        this.calculators = [];
        fieldsWithCalculators.forEach(({ id: targetId, calculators = [] }) => {
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
        this.defineProperties(this.cache, { [ORIGIN_CALCULATORS]: this.calculators, [ORIGIN_NON_SELF_CALCULATORS]: this.nonSelfCalculators });
        this.nonSelfCalculators.length && this.nonSelfBuilders.push(this.builder);
    }
    beforeDestroy() {
        return this.invokeLifeCycle(this.getEventType(DESTROY)).pipe(observableMap(() => transformObservable(super.beforeDestroy())));
    }
    destroy() {
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        this.unDefineProperty(this.builder, ['calculators', 'nonSelfCalculators', this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType', ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS, NON_SELF_BUILDERS]);
        this.unDefineProperty(this, ['lifeActions']);
        return transformObservable(super.destroy()).pipe(tap(() => {
            var _a, _b;
            const parentField = (_a = this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(this.builder.id);
            const instance = (parentField || this.props).instance;
            if (instance) {
                (_b = instance.destroy) === null || _b === void 0 ? void 0 : _b.next(this.props.id || this.builder.id);
                !instance.destroy && (instance.current = null);
            }
        }));
    }
}

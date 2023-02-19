import { flatMap, isEmpty } from 'lodash';
import { of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { observableMap, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
// eslint-disable-next-line max-len
import { CHANGE, DESTORY, LOAD, LOAD_SOURCE, NON_SELF_BUILSERS, ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS } from '../constant/calculator.constant';
export class LifeCycleExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.hasChange = false;
<<<<<<< HEAD
        this.lifeEvent = [LOAD, CHANGE, DESTORY];
=======
        this.lifeEvent = [LOAD, CHANGE];
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
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
<<<<<<< HEAD
=======
        const props = { builder: this.builder, id: this.builder.id };
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        lifeActionsType.forEach((action) => action.runObservable = true);
        this.lifeActions = this.createLifeActions(lifeActionsType);
        this.defineProperty(this.builder, this.getEventType(CHANGE), this.onLifeChange.bind(this));
        return this.invokeLifeCycle(this.getEventType(LOAD), this.props);
    }
    onLifeChange(props) {
        this.hasChange = true;
        this.invokeLifeCycle(this.getEventType(CHANGE), props).subscribe();
        this.hasChange = false;
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
    // eslint-disable-next-line complexity
    linkCalculator(calculator, nonSelfCalculator) {
        const { type, fieldId } = calculator.dependent;
        const sourceField = this.getJsonFieldById(fieldId) || this.json;
        sourceField.actions = this.toArray(sourceField.actions || []);
        const { actions = [], id: sourceId } = sourceField;
        const nonSource = fieldId !== sourceId;
        const isBuildCalculator = this.isBuildField(sourceField) && this.cache.lifeType.includes(type);
        if ((isBuildCalculator || nonSource) && !nonSelfCalculator) {
            this.nonSelfCalculators.push(calculator);
            !isBuildCalculator && this.linkOtherCalculator(calculator);
        }
        if (!nonSource && !actions.some((action) => action.type === type) && !isBuildCalculator) {
            sourceField.actions.unshift({ type });
        }
    }
    linkOtherCalculator(calculator) {
        const { type, fieldId = '' } = calculator.dependent;
        const otherFields = this.builder.root.getAllFieldById(fieldId);
        if (!isEmpty(otherFields)) {
            otherFields.forEach((otherField) => otherField.addEventListener && otherField.addEventListener({ type }));
        }
    }
    createCalculators() {
        const fields = [...this.jsonFields, this.json];
        const fieldsCalculators = this.cloneDeepPlain(fields.filter(({ calculators }) => !isEmpty(calculators)));
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
        this.nonSelfCalculators.length && this.nonSelfBuilders.push(this.builder);
    }
    beforeDestory() {
        return this.invokeLifeCycle(this.getEventType(DESTORY)).pipe(observableMap(() => transformObservable(super.beforeDestory())));
    }
    destory() {
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        this.unDefineProperty(this.builder, ['calculators', 'nonSelfCalculators', this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType', ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS, NON_SELF_BUILSERS]);
        this.unDefineProperty(this, ['detectChanges', 'lifeActions']);
        return transformObservable(super.destory()).pipe(tap(() => {
            var _a, _b;
            const parentField = (_a = this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(this.builder.id);
            const instance = (parentField || this.props).instance;
            instance && ((_b = instance.destory) === null || _b === void 0 ? void 0 : _b.next(this.props.id || this.builder.id));
        }));
    }
}

import { flatMap, groupBy, isEmpty, toArray } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { ACTION_INTERCEPT } from '../../token';
import { BasicUtility } from '../basic-utility/basic-utility';
import { NON_SELF_BUILDERS } from '../constant/calculator.constant';
export class EventHook extends BasicUtility {
    static create(builder, props, cache, json) {
        return new EventHook(builder, props, cache, json);
    }
    constructor(builder, props, cache, json) {
        super(builder, props, cache, json);
        this.calculators = [];
        this.nonSelfCalculators = [];
        this.actionIntercept = this.injector.get(ACTION_INTERCEPT);
        this.defineProperty(this.cache, NON_SELF_BUILDERS, this.builder.root.$$cache.nonSelfBuilders || []);
    }
    serializeCalculators() {
        const fields = [...this.jsonFields, this.json];
        const fieldsWithCalculators = fields.filter(({ calculators }) => !isEmpty(calculators));
        const originCalculators = [];
        this.cache.fields.forEach(({ field }) => delete field.calculators);
        fieldsWithCalculators.forEach(({ id: targetId, calculators = [] }) => {
            this.toArray(calculators).forEach(({ action, dependents }) => {
                this.toArray(action).forEach((a) => {
                    this.toArray(dependents).forEach((dependent) => {
                        originCalculators.push({ targetId, action: this.serializeAction(a), dependent });
                    });
                });
            });
        });
        this.linkCalculators(originCalculators);
    }
    invokeCalculators(actionProps, props, callLink, ...events) {
        const [value, ...otherEvent] = events;
        const nonSelfBuilders = this.nonSelfBuilders || [];
        const calculatorsInvokes = nonSelfBuilders.map((nonBuild) => { var _a, _b; return this.invokeCallCalculators((_b = (_a = this.getEventHook(nonBuild)) === null || _a === void 0 ? void 0 : _a.nonSelfCalculators) !== null && _b !== void 0 ? _b : [], actionProps, { builder: nonBuild, id: props.id }); });
        calculatorsInvokes.push(this.invokeCallCalculators(this.calculators || [], actionProps, props));
        return forkJoin(calculatorsInvokes.map((invokeCalculators) => invokeCalculators(callLink, value, ...otherEvent)));
    }
    linkCalculators(calculators) {
        calculators.forEach((calculator) => this.linkCalculator(calculator));
        this.getNonSelfCalculators().forEach((calculator) => this.linkCalculator(calculator, true));
        this.calculators = calculators.filter((c) => !this.nonSelfCalculators.includes(c));
        this.pushNonBuilders();
    }
    // eslint-disable-next-line complexity
    linkCalculator(calculator, nonSelfCalculator) {
        const { type, fieldId, nonSelf } = calculator.dependent;
        const sourceField = this.getJsonFieldById(fieldId) || this.json;
        sourceField.actions = this.toArray(sourceField.actions || []);
        const { actions = [], id: sourceId } = sourceField;
        const isBuildCalculator = this.isBuildField(sourceField) && this.cache.lifeType.includes(type);
        const nonCalculator = nonSelf || isBuildCalculator || fieldId !== sourceId;
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
        const dependentFields = this.builder.root.getAllFieldById(fieldId).filter(({ events }) => !events[this.getEventType(type)]);
        if (!isEmpty(dependentFields)) {
            dependentFields.forEach((dependentField) => dependentField.addEventListener && dependentField.addEventListener({ type }));
        }
    }
    call(calculators, builder) {
        const groupList = toArray(groupBy(calculators, 'targetId'));
        const inter = this.actionIntercept;
        return (callLink, value, ...other) => forkJoin(groupList.map((links) => {
            return inter.invoke(links.map(({ action }) => (Object.assign(Object.assign({}, action), { callLink }))), { builder, id: links[0].targetId }, value, ...other);
        }));
    }
    invokeCallCalculators(calculators, { type }, props) {
        const { builder, id } = props;
        const filterCalculators = calculators.filter(({ dependent: { fieldId, type: cType } }) => fieldId === id && cType === type);
        return !isEmpty(filterCalculators) ? this.call(filterCalculators, builder) : (_callLink, value) => of(value);
    }
    getEventHook(builder) {
        var _a;
        return (_a = builder.$$cache) === null || _a === void 0 ? void 0 : _a.eventHook;
    }
    getNonSelfCalculators() {
        return flatMap(this.nonSelfBuilders.map((nonSelf) => { var _a; return (_a = this.getEventHook(nonSelf).nonSelfCalculators) !== null && _a !== void 0 ? _a : []; }));
    }
    pushNonBuilders() {
        if (this.nonSelfCalculators.length && this.nonSelfBuilders.indexOf(this.builder) === -1) {
            this.nonSelfBuilders.push(this.builder);
        }
    }
    get nonSelfBuilders() {
        return this.cache.nonSelfBuilders;
    }
    destroy() {
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        [...this.jsonFields, this.json].forEach((item) => delete item.calculators);
        this.unDefineProperty(this, ['calculators', 'nonSelfCalculators']);
        this.unDefineProperty(this.cache, [NON_SELF_BUILDERS]);
    }
}

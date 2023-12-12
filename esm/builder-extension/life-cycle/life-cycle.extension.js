import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { observableMap, observableTap, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, DESTROY, LOAD, LOAD_CALCULATOR, LOAD_SOURCE } from '../constant/calculator.constant';
export class LifeCycleExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.lifeEvent = [LOAD, CHANGE, DESTROY];
        this.calculators = [];
        this.nonSelfCalculators = [];
    }
    extension() {
        this.cache.lifeType = [...this.lifeEvent, ...this.cache.lifeType || []];
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLife.bind(this)),
            dependents: { type: LOAD_CALCULATOR, fieldId: this.builder.id }
        });
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
        transformObservable(onChange.call(this.builder, props)).pipe(observableTap(() => this.invokeLifeCycle(this.getEventType(CHANGE), props))).subscribe();
    }
    invokeLifeCycle(type, event, otherEvent) {
        return this.lifeActions[type] ? this.lifeActions[type](event, otherEvent) : of(event);
    }
    beforeDestroy() {
        return this.invokeLifeCycle(this.getEventType(DESTROY)).pipe(observableMap(() => transformObservable(super.beforeDestroy())));
    }
    destroy() {
        this.unDefineProperty(this.builder, [this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType']);
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

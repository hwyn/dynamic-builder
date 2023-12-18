import { of, Subject } from 'rxjs';
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
        this.parentDestroy = new Subject();
    }
    extension() {
        this.cache.lifeType = [...this.lifeEvent, ...this.cache.lifeType || []];
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLife.bind(this)),
            dependents: { type: LOAD_CALCULATOR, fieldId: this.builder.id }
        });
        // if (this.builder.parent) this.callParentDestroy(this.builder.parent);
    }
    callParentDestroy(parentBuilder) {
        const equal = ({ builder }) => builder === parentBuilder;
        this.cache.bindFn.push(() => this.notifyParentDestroy());
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(() => this.parentDestroy),
            dependents: { type: DESTROY, fieldId: parentBuilder.id, equal, nonSelf: true }
        });
    }
    getLifeActions() {
        const { actions = [] } = this.json;
        const lifeActions = this.lifeEvent.map((type) => actions.find((action) => action.type === type) || { type });
        const loadIndex = lifeActions.findIndex(({ type }) => type === LOAD);
        const loadAction = { before: Object.assign(Object.assign({}, lifeActions[loadIndex]), { type: LOAD_SOURCE }), type: LOAD };
        loadIndex === -1 ? lifeActions.push(loadAction) : lifeActions[loadIndex] = loadAction;
        lifeActions.forEach((action) => action.runObservable = true);
        return lifeActions;
    }
    createLife() {
        this.lifeActions = this.createLifeActions(this.getLifeActions());
        this.defineProperty(this.builder, this.getEventType(CHANGE), this.onLifeChange.bind(this, this.builder.onChange));
        return this.invokeLifeCycle(this.getEventType(LOAD), this.props);
    }
    onLifeChange(onChange, props) {
        transformObservable(onChange.call(this.builder, props)).pipe(observableTap(() => this.invokeLifeCycle(this.getEventType(CHANGE), props))).subscribe();
    }
    invokeLifeCycle(type, event, otherEvent) {
        return this.lifeActions[type] ? this.lifeActions[type](event, otherEvent) : of(event);
    }
    notifyParentDestroy() {
        this.parentDestroy.next(this.builder.id);
        this.parentDestroy.complete();
        this.parentDestroy.unsubscribe();
        this.unDefineProperty(this, ['parentDestroy']);
    }
    beforeDestroy() {
        return this.invokeLifeCycle(this.getEventType(DESTROY)).pipe(observableMap(() => transformObservable(super.beforeDestroy())));
    }
    destroy() {
        this.unDefineProperty(this.builder, [this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType']);
        this.unDefineProperty(this, ['lifeActions']);
        return transformObservable(super.destroy()).pipe(tap(() => {
            var _a;
            const parentField = (_a = this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(this.builder.id);
            const instance = this.props.instance || (parentField === null || parentField === void 0 ? void 0 : parentField.instance);
            if (instance && instance.current === this.builder && !instance.destroy)
                instance.current = null;
        }));
    }
}

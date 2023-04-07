import { isEmpty } from 'lodash';
import { Observable, shareReplay, Subject, tap } from 'rxjs';
import { BuilderModel } from '../../builder/builder-model';
import { observableMap, toForkJoin, transformObservable, withValue } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CURRENT, DESTROY, INSTANCE, LOAD_ACTION, MOUNTED } from '../constant/calculator.constant';
const LISTENER_DETECT = 'listenerDetect';
const DETECT_CHANGES = 'detectChanges';
export class InstanceExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.buildFieldList = [];
    }
    static createInstance() {
        const listenerDetect = new Subject();
        const detectChanges = () => listenerDetect.next(null);
        const instance = {
            current: null,
            onMounted: () => void (0),
            onDestroy: () => void (0),
            destroy: new Subject().pipe(shareReplay(1))
        };
        Object.defineProperty(instance, LISTENER_DETECT, withValue(listenerDetect));
        Object.defineProperty(instance, DETECT_CHANGES, withValue(detectChanges));
        return instance;
    }
    extension() {
        this.buildFieldList = this.mapFields(this.jsonFields, this.addInstance.bind(this));
        const handler = this.eachFields.bind(this, this.jsonFields, this.createInstanceLife.bind(this));
        this.pushCalculators(this.json, [{
                action: this.bindCalculatorAction(handler),
                dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
            }]);
    }
    createInstanceLife([, builderField]) {
        const { instance, events = {} } = builderField;
        this.defineProperties(instance, {
            [this.getEventType(MOUNTED)]: events.onMounted,
            [this.getEventType(DESTROY)]: events.onDestroy
        });
        Object.defineProperty(instance, CURRENT, this.getCurrentProperty(builderField));
        delete events.onMounted;
        delete events.onDestroy;
    }
    getCurrentProperty({ instance, id }) {
        let _current;
        const get = () => _current;
        const set = (current) => {
            const hasMounted = !!current && _current !== current;
            _current = current;
            if (hasMounted) {
                instance.onMounted(id);
            }
            if (current instanceof BuilderModel && current.id !== id) {
                console.info(`Builder needs to set the id property: ${id}`);
            }
        };
        return { get, set };
    }
    addInstance([jsonField, builderField]) {
        const destroy = { type: DESTROY, after: this.bindCalculatorAction(this.instanceDestroy) };
        const instance = InstanceExtension.createInstance();
        this.pushAction(jsonField, [destroy, { type: MOUNTED }]);
        this.defineProperty(builderField, INSTANCE, instance);
        instance.destroy.subscribe();
    }
    instanceDestroy({ actionEvent, builderField: { instance } }) {
        const currentIsBuildModel = instance.current instanceof BuilderModel;
        instance.current && (instance.current = null);
        return !currentIsBuildModel && instance.destroy.next(actionEvent);
    }
    beforeDestroy() {
        const showFields = this.buildFieldList.filter(({ visibility }) => this.builder.showField(visibility));
        if (!isEmpty(showFields)) {
            const subscriptions = [];
            return toForkJoin(showFields.map(({ id, instance }) => new Observable((subscribe) => {
                subscriptions.push(instance.destroy.subscribe(() => {
                    subscribe.next(id);
                    subscribe.complete();
                }));
            }))).pipe(tap(() => subscriptions.forEach((s) => s.unsubscribe())), observableMap(() => transformObservable(super.beforeDestroy())));
        }
    }
    destroy() {
        this.buildFieldList.forEach((buildField) => {
            const { instance } = buildField;
            instance.destroy.unsubscribe();
            instance.listenerDetect.unsubscribe();
            this.unDefineProperty(instance, [DETECT_CHANGES, LISTENER_DETECT, this.getEventType(DESTROY), this.getEventType(MOUNTED), CURRENT]);
            this.defineProperty(buildField, INSTANCE, null);
        });
        return super.destroy();
    }
}

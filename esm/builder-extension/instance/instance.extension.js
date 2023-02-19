import { isEmpty } from 'lodash';
import { Observable, shareReplay, Subject } from 'rxjs';
import { BuilderModel } from '../../builder/builder-model';
import { observableMap, toForkJoin, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CURRENT, DESTORY, INSTANCE, LOAD_ACTION, MOUNTED } from '../constant/calculator.constant';
export class InstanceExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.buildFieldList = [];
    }
    static createInstance() {
        return {
            current: null,
            onMounted: () => void (0),
            onDestory: () => void (0),
            detectChanges: () => undefined,
            destory: new Subject().pipe(shareReplay(1))
        };
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
        this.definePropertys(instance, {
            [this.getEventType(MOUNTED)]: events.onMounted,
            [this.getEventType(DESTORY)]: events.onDestory
        });
        Object.defineProperty(instance, CURRENT, this.getCurrentProperty(builderField));
        delete events.onMounted;
        delete events.onDestory;
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
        const destory = { type: DESTORY, after: this.bindCalculatorAction(this.instanceDestory.bind(this)) };
        const instance = InstanceExtension.createInstance();
        this.pushAction(jsonField, [destory, { type: MOUNTED }]);
        this.defineProperty(builderField, INSTANCE, instance);
        instance.destory.subscribe();
    }
    instanceDestory({ actionEvent, builderField: { instance } }) {
        const currentIsBuildModel = instance.current instanceof BuilderModel;
        instance.current && (instance.current = null);
        instance.detectChanges = () => undefined;
        return !currentIsBuildModel && instance.destory.next(actionEvent);
    }
    beforeDestory() {
        const showFields = this.buildFieldList.filter(({ visibility }) => this.builder.showField(visibility));
        if (!isEmpty(showFields)) {
            return toForkJoin(showFields.map(({ id, instance }) => new Observable((subscribe) => {
                instance.destory.subscribe(() => {
                    subscribe.next(id);
                    subscribe.complete();
                });
            }))).pipe(observableMap(() => transformObservable(super.beforeDestory())));
        }
    }
    destory() {
        this.buildFieldList.forEach((buildField) => {
            const { instance } = buildField;
            instance.destory.unsubscribe();
            this.unDefineProperty(instance, ['detectChanges', this.getEventType(DESTORY), this.getEventType(MOUNTED), CURRENT]);
            this.defineProperty(buildField, INSTANCE, null);
        });
        return super.destory();
    }
}

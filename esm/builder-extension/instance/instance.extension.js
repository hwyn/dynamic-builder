import { Observable, Subject } from '@fm/import-rxjs';
import { isEmpty } from 'lodash';
import { BuilderModel } from '../../builder/builder-model';
import { observableMap, toForkJoin, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CURRENT, DESTORY, INSTANCE, LOAD_ACTION, MOUNTED } from '../constant/calculator.constant';
export class InstanceExtension extends BasicExtension {
    buildFieldList = [];
    static createInstance() {
        return {
            current: null,
            destory: new Subject(),
            onMounted: () => void (0),
            onDestory: () => void (0),
            detectChanges: () => undefined,
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
            [this.getEventType(DESTORY)]: this.proxyDestory(instance, events.onDestory)
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
            if (current instanceof BuilderModel && !current.id) {
                console.error(`Builder needs to set the ID property: ${id}`);
            }
        };
        return { get, set };
    }
    addInstance([jsonField, builderField]) {
        this.pushAction(jsonField, [{ type: DESTORY, runObservable: true }, { type: MOUNTED }]);
        this.defineProperty(builderField, INSTANCE, InstanceExtension.createInstance());
    }
    proxyDestory(instance, onDestory) {
        const destoryHandler = (actionEvent) => {
            const currentIsBuildModel = instance.current instanceof BuilderModel;
            instance.current && (instance.current = null);
            instance.detectChanges = () => undefined;
            !currentIsBuildModel && instance.destory.next(actionEvent);
        };
        return (...args) => onDestory(...args).subscribe(destoryHandler);
    }
    beforeDestory() {
        if (!isEmpty(this.buildFieldList)) {
            return toForkJoin(this.buildFieldList.map(({ id, instance }) => new Observable((subscribe) => {
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

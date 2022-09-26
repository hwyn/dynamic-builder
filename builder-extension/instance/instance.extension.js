"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceExtension = void 0;
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const builder_model_1 = require("../../builder/builder-model");
const utility_1 = require("../../utility");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
class InstanceExtension extends basic_extension_1.BasicExtension {
    buildFieldList = [];
    static createInstance() {
        return {
            current: null,
            destory: new rxjs_1.Subject(),
            onMounted: () => void (0),
            onDestory: () => void (0),
            detectChanges: () => undefined
        };
    }
    extension() {
        this.buildFieldList = this.mapFields(this.jsonFields, this.addInstance.bind(this));
        const handler = this.eachFields.bind(this, this.jsonFields, this.createInstanceLife.bind(this));
        this.pushCalculators(this.json, [{
                action: this.bindCalculatorAction(handler),
                dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: this.builder.id }
            }]);
    }
    createInstanceLife([, builderField]) {
        const { instance, events = {} } = builderField;
        this.definePropertys(instance, {
            [this.getEventType(calculator_constant_1.MOUNTED)]: events.onMounted,
            [this.getEventType(calculator_constant_1.DESTORY)]: events.onDestory
        });
        Object.defineProperty(instance, calculator_constant_1.CURRENT, this.getCurrentProperty(builderField));
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
            if (current instanceof builder_model_1.BuilderModel && !current.id) {
                console.error(`Builder needs to set the ID property: ${id}`);
            }
        };
        return { get, set };
    }
    addInstance([jsonField, builderField]) {
        const destory = { type: calculator_constant_1.DESTORY, after: this.bindCalculatorAction(this.instanceDestory.bind(this)) };
        this.pushAction(jsonField, [destory, { type: calculator_constant_1.MOUNTED }]);
        this.defineProperty(builderField, calculator_constant_1.INSTANCE, InstanceExtension.createInstance());
    }
    instanceDestory({ actionEvent, builderField: { instance } }) {
        const currentIsBuildModel = instance.current instanceof builder_model_1.BuilderModel;
        instance.current && (instance.current = null);
        instance.detectChanges = () => undefined;
        return !currentIsBuildModel && instance.destory.next(actionEvent);
    }
    beforeDestory() {
        if (!(0, lodash_1.isEmpty)(this.buildFieldList)) {
            return (0, utility_1.toForkJoin)(this.buildFieldList.map(({ id, instance }) => new rxjs_1.Observable((subscribe) => {
                instance.destory.subscribe(() => {
                    subscribe.next(id);
                    subscribe.complete();
                });
            }))).pipe((0, utility_1.observableMap)(() => (0, utility_1.transformObservable)(super.beforeDestory())));
        }
    }
    destory() {
        this.buildFieldList.forEach((buildField) => {
            const { instance } = buildField;
            instance.destory.unsubscribe();
            this.unDefineProperty(instance, ['detectChanges', this.getEventType(calculator_constant_1.DESTORY), this.getEventType(calculator_constant_1.MOUNTED), calculator_constant_1.CURRENT]);
            this.defineProperty(buildField, calculator_constant_1.INSTANCE, null);
        });
        return super.destory();
    }
}
exports.InstanceExtension = InstanceExtension;

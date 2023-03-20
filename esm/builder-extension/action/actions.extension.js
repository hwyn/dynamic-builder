import { isEmpty, isPlainObject } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { ADD_EVENT_LISTENER, EVENTS, LOAD_ACTION, LOAD_VIEW_MODEL } from '../constant/calculator.constant';
const CACHE_ACTION = 'cacheAction';
export class ActionExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.fields = [];
    }
    beforeExtension() {
        [this.json, ...this.jsonFields].forEach((jsonField) => {
            const { actions } = jsonField;
            if (!Array.isArray(actions) && isPlainObject(actions)) {
                jsonField.actions = Object.keys(actions).map((key) => this.bindCalculatorAction(actions[key], key));
            }
        });
    }
    extension() {
        const handler = this.eachFields.bind(this, this.jsonFields, this.create.bind(this));
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(handler, LOAD_ACTION),
            dependents: { type: LOAD_VIEW_MODEL, fieldId: this.builder.id }
        });
    }
    create([jsonField, builderField]) {
        const { actions = [] } = jsonField;
        this.definePropertys(builderField, { [ADD_EVENT_LISTENER]: this.addFieldEvent.bind(this, builderField), [CACHE_ACTION]: [] });
        if (!isEmpty(actions))
            builderField.addEventListener(actions);
        this.fields.push(builderField);
        delete builderField.field.actions;
    }
    addFieldEvent(builderField, actions) {
        const { events = {}, id } = builderField;
        const addActions = this.toArray(actions).filter(({ type }) => !events[this.getEventType(type)]);
        if (!isEmpty(addActions)) {
            const addEvents = this.createActions(this.toArray(addActions), { builder: this.builder, id }, { injector: this.injector });
            this.defineProperty(builderField, EVENTS, Object.assign(Object.assign({}, events), addEvents));
            builderField.instance.detectChanges();
        }
    }
    destroy() {
        this.fields.forEach((field) => this.unDefineProperty(field, [CACHE_ACTION, EVENTS, ADD_EVENT_LISTENER]));
        super.destroy();
    }
}

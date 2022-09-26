"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionExtension = void 0;
const lodash_1 = require("lodash");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
class ActionExtension extends basic_extension_1.BasicExtension {
    fields = [];
    extension() {
        const eachCallback = this.create.bind(this);
        const handler = this.eachFields.bind(this, this.jsonFields, eachCallback);
        this.pushCalculators(this.json, {
            action: { type: calculator_constant_1.LOAD_ACTION, handler },
            dependents: { type: calculator_constant_1.LOAD_VIEW_MODEL, fieldId: this.builder.id }
        });
    }
    create([jsonField, builderField]) {
        const { actions = [] } = jsonField;
        this.defineProperty(builderField, calculator_constant_1.ADD_EVENT_LISTENER, this.addFieldEvent.bind(this, builderField));
        if (!(0, lodash_1.isEmpty)(actions))
            builderField.addEventListener(actions);
        this.fields.push(builderField);
        delete builderField.field.actions;
    }
    addFieldEvent(builderField, actions) {
        const { events = {}, id } = builderField;
        const addActions = this.toArray(actions).filter(({ type }) => !events[this.getEventType(type)]);
        if (!(0, lodash_1.isEmpty)(addActions)) {
            const addEvents = this.createActions(this.toArray(addActions), { builder: this.builder, id }, { injector: this.injector });
            this.defineProperty(builderField, calculator_constant_1.EVENTS, { ...events, ...addEvents });
            builderField.instance.detectChanges();
        }
    }
    destory() {
        this.fields.forEach((field) => this.unDefineProperty(field, [calculator_constant_1.EVENTS, calculator_constant_1.ADD_EVENT_LISTENER]));
        super.destory();
    }
}
exports.ActionExtension = ActionExtension;

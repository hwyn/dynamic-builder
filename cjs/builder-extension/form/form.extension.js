"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormExtension = void 0;
const lodash_1 = require("lodash");
const builder_1 = require("../../builder");
const token_1 = require("../../token");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
class FormExtension extends basic_extension_1.BasicExtension {
    builderFields = [];
    defaultChangeType = calculator_constant_1.CHANGE;
    extension() {
        this.builderFields = this.mapFields(this.jsonFields.filter(({ binding }) => !(0, lodash_1.isEmpty)(binding)), this.createMergeControl.bind(this));
    }
    createMergeControl([jsonField, builderField]) {
        const { id, updateOn, checkVisibility, validators } = jsonField;
        const changeType = this.getChangeType(jsonField);
        this.addChangeAction(changeType, jsonField);
        this.pushCalculators(jsonField, [{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField)),
                dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: this.builder.id }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: calculator_constant_1.NOTIFY_VIEW_MODEL_CHANGE, fieldId: this.builder.id }
            },
            ...checkVisibility ? [{
                    action: this.bindCalculatorAction(this.createVisibility.bind(this)),
                    dependents: { type: calculator_constant_1.CHECK_VISIBILITY, fieldId: id }
                }] : [],
            ...validators ? [{
                    action: this.bindCalculatorAction(this.createValidaity.bind(this)),
                    dependents: { type: updateOn || changeType, fieldId: id }
                }] : []]);
    }
    addChangeAction(changeType, jsonField) {
        const { actions = [] } = jsonField;
        let changeAction = actions.find(({ type }) => type === changeType);
        jsonField.actions = actions;
        !changeAction && actions.push(changeAction = { type: changeType });
        changeAction.after = this.bindCalculatorAction(this.createChange.bind(this, jsonField));
    }
    addControl(jsonField, builderField) {
        const value = this.getValueToModel(jsonField.binding, builderField);
        const control = this.ls.getProvider(token_1.BIND_FORM_CONTROL, value, { builder: this.builder, builderField });
        this.defineProperty(builderField, calculator_constant_1.CONTROL, control);
        delete builderField.field.binding;
        this.excuteChangeEvent(jsonField, value);
        this.changeVisibility(builderField, builderField.visibility);
    }
    createChange({ binding }, { builderField, actionEvent }) {
        const value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.setValueToModel(binding, value, builderField);
        builderField.control?.patchValue(value);
        builderField.instance?.detectChanges();
    }
    createValidaity({ builderField: { control }, builder: { ready } }) {
        ready && control?.updateValueAndValidity();
    }
    createVisibility({ builderField, builder: { ready }, actionEvent }) {
        ready && this.changeVisibility(builderField, actionEvent);
    }
    changeVisibility({ control }, visibility = builder_1.Visibility.visible) {
        if (control) {
            const { none, disabled, hidden, readonly } = builder_1.Visibility;
            const isDisabled = [none, hidden, disabled, readonly].includes(visibility);
            isDisabled ? control.disable() : control.enable();
        }
    }
    excuteChangeEvent(jsonField, value) {
        const { events = {} } = this.getBuilderFieldById(jsonField.id);
        return events[this.getEventType(this.getChangeType(jsonField))](value);
    }
    createNotifyChange(jsonField, { actionEvent, builderField }) {
        if (!actionEvent || actionEvent === builderField) {
            const { binding } = jsonField;
            this.excuteChangeEvent(jsonField, this.getValueToModel(binding, builderField));
        }
    }
    getChangeType(jsonField) {
        const { binding: { changeType = this.defaultChangeType } } = jsonField;
        return changeType;
    }
    getValueToModel(binding, builderField) {
        return this.cache.viewModel.getBindValue(binding, builderField);
    }
    setValueToModel(binding, value, builderField) {
        this.cache.viewModel.setBindValue(binding, value, builderField);
    }
    isDomEvent(actionResult) {
        return actionResult && actionResult.target && !!actionResult.target.nodeType;
    }
    destory() {
        this.builderFields.forEach((builderField) => {
            builderField.control?.destory();
            this.defineProperty(builderField, calculator_constant_1.CONTROL, null);
        });
        return super.destory();
    }
}
exports.FormExtension = FormExtension;

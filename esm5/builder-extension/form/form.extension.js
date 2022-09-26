import { isEmpty } from 'lodash';
import { Visibility } from '../../builder';
import { FORM_CONTROL } from '../../token';
import { transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, CONTROL, LOAD_ACTION, NOTIFY_VIEW_MODEL_CHANGE } from '../constant/calculator.constant';
export class FormExtension extends BasicExtension {
    builderFields = [];
    defaultChangeType = CHANGE;
    extension() {
        this.builderFields = this.mapFields(this.jsonFields.filter(({ binding }) => !isEmpty(binding)), this.createMergeControl.bind(this));
    }
    createMergeControl([jsonField, builderField]) {
        const { id, updateOn, checkVisibility, validators } = jsonField;
        const changeType = this.getChangeType(jsonField);
        const builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField);
        this.pushCalculators(jsonField, [{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField)),
                dependents: { type: LOAD_ACTION, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: NOTIFY_VIEW_MODEL_CHANGE, fieldId: builderId }
            },
            ...checkVisibility ? [{
                    action: this.bindCalculatorAction(this.createVisibility.bind(this)),
                    dependents: { type: CHECK_VISIBILITY, fieldId: id }
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
        const control = this.injector.get(FORM_CONTROL, value, { builder: this.builder, builderField });
        this.defineProperty(builderField, CONTROL, control);
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
        return ready && transformObservable(control?.updateValueAndValidity());
    }
    createVisibility({ builderField, builder: { ready }, actionEvent }) {
        ready && this.changeVisibility(builderField, actionEvent);
    }
    changeVisibility({ control }, visibility = Visibility.visible) {
        if (control) {
            const { none, disabled, hidden, readonly } = Visibility;
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
            this.defineProperty(builderField, CONTROL, null);
        });
        return super.destory();
    }
}

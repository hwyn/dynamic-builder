import { isEmpty } from 'lodash';
import { tap } from 'rxjs';
import { Visibility } from '../../builder';
import { FORM_CONTROL } from '../../token';
import { transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, CONTROL, LOAD, NOTIFY_MODEL_CHANGE } from '../constant/calculator.constant';
export class FormExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.builderFields = [];
        this.defaultChangeType = CHANGE;
        this.getControl = this.injector.get(FORM_CONTROL);
    }
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
                dependents: { type: LOAD, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: NOTIFY_MODEL_CHANGE, fieldId: builderId }
            },
            ...checkVisibility ? [{
                    action: this.bindCalculatorAction(this.createVisibility.bind(this, jsonField)),
                    dependents: { type: CHECK_VISIBILITY, fieldId: id }
                }] : [],
            ...validators && !validators.length ? [{
                    action: this.bindCalculatorAction(this.createValidaity.bind(this)),
                    dependents: { type: updateOn || changeType, fieldId: id }
                }] : []]);
    }
    addChangeAction(changeType, jsonField) {
        const { actions = [], binding: { intercept = '' } } = jsonField;
        const actionIndex = actions.findIndex(({ type }) => type === changeType);
        const replaceAction = { type: changeType };
        const bindingViewModel = Object.assign(Object.assign({}, this.bindCalculatorAction(this.createChange.bind(this, jsonField))), actions[actionIndex] ? { after: this.bindCalculatorAction(actions[actionIndex]) } : {});
        jsonField.actions = actions;
        replaceAction.before = intercept ? Object.assign(Object.assign({}, this.bindCalculatorAction(intercept)), { after: bindingViewModel }) : bindingViewModel;
        actionIndex === -1 ? actions.push(replaceAction) : actions[actionIndex] = replaceAction;
    }
    addControl(jsonField, builderField) {
        const { binding } = jsonField;
        const value = this.getValueToModel(binding);
        const control = this.getControl(value, { builder: this.builder, builderField });
        this.defineProperty(builderField, CONTROL, control);
        this.excuteChangeEvent(jsonField, value);
        this.changeVisibility(builderField, binding, builderField.visibility);
        delete builderField.field.binding;
    }
    createChange({ binding }, { builderField, actionEvent }) {
        var _a, _b;
        const value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.setValueToModel(binding, value);
        (_a = builderField.control) === null || _a === void 0 ? void 0 : _a.patchValue(value);
        (_b = builderField.instance) === null || _b === void 0 ? void 0 : _b.detectChanges();
    }
    createValidaity({ builderField: { control, instance } }) {
        return transformObservable(control === null || control === void 0 ? void 0 : control.updateValueAndValidity()).pipe(tap(() => instance.detectChanges()));
    }
    createVisibility({ binding }, { builderField, actionEvent }) {
        this.changeVisibility(builderField, binding, actionEvent);
    }
    changeVisibility(builderField, binding, visibility = Visibility.visible) {
        const { control, visibility: v } = builderField;
        if (control && v !== visibility) {
            const { none, disabled, hidden, readonly } = Visibility;
            const isDisabled = [none, hidden, disabled, readonly].includes(visibility);
            isDisabled ? control.disable() : control.enable();
            visibility === none ? this.deleteValueToModel(binding) : this.setValueToModel(binding, control.value);
        }
    }
    excuteChangeEvent(jsonField, value) {
        const { events = {} } = this.getBuilderFieldById(jsonField.id);
        return events[this.getEventType(this.getChangeType(jsonField))](value);
    }
    createNotifyChange(jsonField, { actionEvent, builderField }) {
        if (!actionEvent || actionEvent === builderField) {
            this.excuteChangeEvent(jsonField, this.getValueToModel(jsonField.binding));
        }
    }
    getChangeType(jsonField) {
        const { binding: { changeType = this.defaultChangeType } } = jsonField;
        return changeType;
    }
    getValueToModel(binding) {
        return this.cache.viewModel.getBindValue(binding);
    }
    setValueToModel(binding, value) {
        this.cache.viewModel.setBindValue(binding, value);
    }
    deleteValueToModel(binding) {
        this.cache.viewModel.deleteBindValue(binding);
    }
    isDomEvent(actionResult) {
        return actionResult && actionResult.target && !!actionResult.target.nodeType;
    }
    destory() {
        this.builderFields.forEach((builderField) => {
            var _a;
            (_a = builderField.control) === null || _a === void 0 ? void 0 : _a.destory();
            this.defineProperty(builderField, CONTROL, null);
        });
        return super.destory();
    }
}

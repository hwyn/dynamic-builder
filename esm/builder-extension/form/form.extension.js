import { isEmpty } from 'lodash';
import { Visibility } from '../../builder';
import { CONVERT_INTERCEPT, FORM_CONTROL } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, CONTROL, LOAD_ACTION, NOTIFY_MODEL_CHANGE } from '../constant/calculator.constant';
export class FormExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.convertMap = new Map();
        this.builderFields = [];
        this.defaultChangeType = CHANGE;
        this.getControl = this.injector.get(FORM_CONTROL);
        this.convertIntercept = this.injector.get(CONVERT_INTERCEPT);
    }
    extension() {
        this.builderFields = this.mapFields(this.jsonFields.filter(({ binding }) => !isEmpty(binding)), this.createMergeControl.bind(this));
    }
    createMergeControl([jsonField, builderField]) {
        const changeType = this.getChangeType(jsonField);
        const { id, updateOn = changeType, checkVisibility, validators } = jsonField;
        const builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField, builderField);
        this.pushCalculators(jsonField, [{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField)),
                dependents: { type: LOAD_ACTION, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: NOTIFY_MODEL_CHANGE, fieldId: builderId }
            },
            ...checkVisibility ? [{
                    action: this.bindCalculatorAction(this.createVisibility.bind(this, jsonField)),
                    dependents: { type: CHECK_VISIBILITY, fieldId: id }
                }] : [],
            ...validators && validators.length ? [{
                    action: this.bindCalculatorAction(this.createValidity.bind(this)),
                    dependents: this.toArray(updateOn).map((type) => ({ type: type, fieldId: id }))
                }] : []]);
    }
    addChangeAction(changeType, jsonField, builderField) {
        const { id, actions = [], binding } = jsonField;
        const { convert, intercept = '' } = binding;
        const actionIndex = actions.findIndex(({ type }) => type === changeType);
        const changeAfter = this.bindCalculatorAction(this.detectChanges.bind(this, id));
        const newAction = { type: changeType, after: changeAfter };
        const bindingAction = this.bindCalculatorAction(this.createChange.bind(this, jsonField));
        if (actions[actionIndex]) {
            bindingAction.after = this.bindCalculatorAction(actions[actionIndex]);
        }
        jsonField.actions = actions;
        newAction.before = intercept ? Object.assign(Object.assign({}, this.bindCalculatorAction(intercept)), { after: bindingAction }) : bindingAction;
        actionIndex === -1 ? actions.push(newAction) : actions[actionIndex] = newAction;
        this.convertMap.set(binding, this.convertIntercept.getConvertObj(convert, this.builder, builderField));
    }
    addControl(jsonField, builderField) {
        const { binding } = jsonField;
        const value = this.getValueToModel(binding);
        const control = this.getControl(value, { builder: this.builder, builderField });
        this.defineProperty(builderField, CONTROL, control);
        this.executeChangeEvent(jsonField, value);
        this.changeVisibility(builderField, binding, builderField.visibility);
        delete builderField.field.binding;
        delete builderField.field.updateOn;
    }
    createChange({ binding }, { builderField, actionEvent }) {
        var _a;
        const { visibility } = builderField;
        const value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.builder.showField(visibility) && this.setValueToModel(binding, value);
        (_a = builderField.control) === null || _a === void 0 ? void 0 : _a.patchValue(value);
        return actionEvent;
    }
    createValidity({ builderField: { control } }) {
        control === null || control === void 0 ? void 0 : control.updateValueAndValidity();
    }
    createVisibility({ binding }, { builderField, actionEvent }) {
        this.changeVisibility(builderField, binding, actionEvent);
    }
    changeVisibility(builderField, binding, visibility = Visibility.visible) {
        const { control, visibility: v = Visibility.visible } = builderField;
        if (control && v !== visibility) {
            const { none, disabled, hidden, readonly } = Visibility;
            const isDisabled = [none, hidden, disabled, readonly].includes(visibility);
            isDisabled ? control.disable() : control.enable();
            this.builder.showField(visibility) ? this.setValueToModel(binding, control.value) : this.deleteValueToModel(binding);
        }
    }
    executeChangeEvent(jsonField, value) {
        const { events = {} } = this.getBuilderFieldById(jsonField.id);
        return events[this.getEventType(this.getChangeType(jsonField))](value);
    }
    createNotifyChange(jsonField, { actionEvent, builderField }) {
        if (!actionEvent || actionEvent === builderField) {
            this.executeChangeEvent(jsonField, this.getValueToModel(jsonField.binding));
        }
    }
    detectChanges(id) {
        const { instance } = this.builder.getFieldById(id);
        instance === null || instance === void 0 ? void 0 : instance.detectChanges();
    }
    getChangeType(jsonField) {
        const { binding: { changeType = this.defaultChangeType } } = jsonField;
        return jsonField.binding.changeType = changeType;
    }
    getValueToModel(binding) {
        const { path, default: initialValue } = binding;
        return this.convertIntercept.toView(this.convertMap.get(binding), this.cache.viewModel.getBindValue(path, initialValue));
    }
    setValueToModel(binding, value) {
        this.cache.viewModel.setBindValue(binding.path, this.convertIntercept.toModel(this.convertMap.get(binding), value));
    }
    deleteValueToModel(binding) {
        this.cache.viewModel.deleteBindValue(binding.path);
    }
    isDomEvent(actionResult) {
        return actionResult && actionResult.target && !!actionResult.target.nodeType;
    }
    destroy() {
        this.convertMap.clear();
        this.builderFields.forEach((builderField) => {
            var _a;
            if ((_a = builderField.control) === null || _a === void 0 ? void 0 : _a.destroy) {
                builderField.control.destroy();
            }
            this.unDefineProperty(builderField, [CONTROL]);
        });
        return super.destroy();
    }
}

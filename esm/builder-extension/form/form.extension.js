/* eslint-disable max-len */
import { isEmpty } from 'lodash';
import { Visibility } from '../../builder';
import { CONVERT_INTERCEPT, FORM_CONTROL } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, CONTROL, CREATE_CONTROL, DESTROY, LOAD_ACTION, NOTIFY_MODEL_CHANGE } from '../constant/calculator.constant';
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
        const builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField, builderField);
        this.pushCalculators(jsonField, [{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField), CREATE_CONTROL),
                dependents: { type: LOAD_ACTION, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: NOTIFY_MODEL_CHANGE, fieldId: builderId }
            },
            {
                action: this.bindCalculatorAction(this.createVisibility.bind(this, jsonField)),
                dependents: [
                    { type: DESTROY, fieldId: jsonField.id },
                    { type: CHECK_VISIBILITY, fieldId: jsonField.id }
                ]
            }]);
    }
    addChangeAction(changeType, jsonField, builderField) {
        const { actions = [], binding } = jsonField;
        const { convert, intercept = '' } = binding;
        const actionIndex = actions.findIndex(({ type }) => type === changeType);
        const newAction = actionIndex === -1 ? { type: changeType } : this.bindCalculatorAction(actions[actionIndex], changeType);
        const bindingAction = this.bindCalculatorAction(this.createChange.bind(this, jsonField));
        jsonField.actions = actions;
        newAction.after = this.bindCalculatorAction(this.detectChanges.bind(this, builderField));
        newAction.before = intercept ? Object.assign(Object.assign({}, this.bindCalculatorAction(intercept)), { after: bindingAction }) : bindingAction;
        actionIndex === -1 ? actions.push(newAction) : actions[actionIndex] = newAction;
        if (convert) {
            this.convertMap.set(binding, this.convertIntercept.getConvertObj(convert, this.builder, builderField));
        }
    }
    addControl(jsonField, builderField) {
        const { binding } = jsonField;
        const value = this.getValueToModel(binding);
        const control = this.getControl(value, { builder: this.builder, builderField });
        this.defineProperty(builderField, CONTROL, control);
        this.executeChangeEvent(jsonField, value);
        this.changeVisibility(builderField, binding, builderField.visibility);
        delete builderField.events[this.getEventType(CREATE_CONTROL)];
        delete builderField.field.binding;
    }
    createChange({ binding }, { builderField, actionEvent }) {
        var _a;
        const value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.builder.showField(builderField.visibility) && this.setValueToModel(binding, value);
        (_a = builderField.control) === null || _a === void 0 ? void 0 : _a.patchValue(value);
        return actionEvent;
    }
    createVisibility({ binding }, { callLink, builderField, actionEvent }) {
        var _a;
        const { control, visibility = Visibility.visible } = builderField;
        const _actionEvent = ((_a = callLink[0]) === null || _a === void 0 ? void 0 : _a.type) === DESTROY ? Visibility.none : actionEvent;
        if (control && visibility !== _actionEvent) {
            this.changeVisibility(builderField, binding, _actionEvent);
        }
    }
    changeVisibility(builderField, binding, visibility = Visibility.visible) {
        const { control } = builderField;
        const { none, disabled, hidden, readonly } = Visibility;
        [none, hidden, disabled, readonly].includes(visibility) ? control.disable() : control.enable();
        this.builder.showField(visibility) ? this.setValueToModel(binding, control === null || control === void 0 ? void 0 : control.value) : this.deleteValueToModel(binding);
    }
    executeChangeEvent(jsonField, value) {
        const { events = {} } = this.getBuilderFieldById(jsonField.id);
        return events[this.getEventType(this.getChangeType(jsonField))](value);
    }
    createNotifyChange(jsonField, { actionEvent, builderField }) {
        const { control } = builderField;
        if ((!actionEvent || actionEvent === builderField) && control) {
            const value = this.getValueToModel(jsonField.binding);
            if (control.value !== value)
                this.executeChangeEvent(jsonField, value);
        }
    }
    detectChanges({ instance }) {
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
        binding.path && this.cache.viewModel.setBindValue(binding.path, this.convertIntercept.toModel(this.convertMap.get(binding), value));
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

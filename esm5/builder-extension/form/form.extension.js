import { __assign, __extends, __spreadArray } from "tslib";
import { isEmpty } from 'lodash';
import { Visibility } from '../../builder';
import { COVERT_INTERCEPT, FORM_CONTROL } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, CONTROL, LOAD_ACTION, NOTIFY_MODEL_CHANGE } from '../constant/calculator.constant';
var FormExtension = /** @class */ (function (_super) {
    __extends(FormExtension, _super);
    function FormExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.covertMap = new Map();
        _this.builderFields = [];
        _this.defaultChangeType = CHANGE;
        _this.getControl = _this.injector.get(FORM_CONTROL);
        _this.covertIntercept = _this.injector.get(COVERT_INTERCEPT);
        return _this;
    }
    FormExtension.prototype.extension = function () {
        this.builderFields = this.mapFields(this.jsonFields.filter(function (_a) {
            var binding = _a.binding;
            return !isEmpty(binding);
        }), this.createMergeControl.bind(this));
    };
    FormExtension.prototype.createMergeControl = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        var changeType = this.getChangeType(jsonField);
        var id = jsonField.id, _b = jsonField.updateOn, updateOn = _b === void 0 ? changeType : _b, checkVisibility = jsonField.checkVisibility, validators = jsonField.validators;
        var builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField, builderField);
        this.pushCalculators(jsonField, __spreadArray(__spreadArray([{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField)),
                dependents: { type: LOAD_ACTION, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: NOTIFY_MODEL_CHANGE, fieldId: builderId }
            }], checkVisibility ? [{
                action: this.bindCalculatorAction(this.createVisibility.bind(this, jsonField)),
                dependents: { type: CHECK_VISIBILITY, fieldId: id }
            }] : [], true), validators && validators.length ? [{
                action: this.bindCalculatorAction(this.createValidaity.bind(this)),
                dependents: { type: updateOn, fieldId: id }
            }] : [], true));
    };
    FormExtension.prototype.addChangeAction = function (changeType, jsonField, builderField) {
        var id = jsonField.id, _a = jsonField.actions, actions = _a === void 0 ? [] : _a, binding = jsonField.binding;
        var covert = binding.covert, _b = binding.intercept, intercept = _b === void 0 ? '' : _b;
        var actionIndex = actions.findIndex(function (_a) {
            var type = _a.type;
            return type === changeType;
        });
        var changeAfter = this.bindCalculatorAction(this.detectChanges.bind(this, id));
        var replaceAction = { type: changeType, after: changeAfter };
        var bindingViewModel = this.bindCalculatorAction(this.createChange.bind(this, jsonField));
        if (actions[actionIndex]) {
            bindingViewModel.after = this.bindCalculatorAction(actions[actionIndex]);
        }
        jsonField.actions = actions;
        replaceAction.before = intercept ? __assign(__assign({}, this.bindCalculatorAction(intercept)), { after: bindingViewModel }) : bindingViewModel;
        actionIndex === -1 ? actions.push(replaceAction) : actions[actionIndex] = replaceAction;
        this.covertMap.set(binding, this.covertIntercept.getCovertObj(covert, this.builder, builderField));
    };
    FormExtension.prototype.addControl = function (jsonField, builderField) {
        var binding = jsonField.binding;
        var value = this.getValueToModel(binding);
        var control = this.getControl(value, { builder: this.builder, builderField: builderField });
        this.defineProperty(builderField, CONTROL, control);
        this.excuteChangeEvent(jsonField, value);
        this.changeVisibility(builderField, binding, builderField.visibility);
        delete builderField.field.binding;
    };
    FormExtension.prototype.createChange = function (_a, _b) {
        var _c;
        var binding = _a.binding;
        var builderField = _b.builderField, actionEvent = _b.actionEvent;
        var value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.setValueToModel(binding, value);
        (_c = builderField.control) === null || _c === void 0 ? void 0 : _c.patchValue(value);
    };
    FormExtension.prototype.createValidaity = function (_a) {
        var control = _a.builderField.control;
        control === null || control === void 0 ? void 0 : control.updateValueAndValidity();
    };
    FormExtension.prototype.createVisibility = function (_a, _b) {
        var binding = _a.binding;
        var builderField = _b.builderField, actionEvent = _b.actionEvent;
        this.changeVisibility(builderField, binding, actionEvent);
    };
    FormExtension.prototype.changeVisibility = function (builderField, binding, visibility) {
        if (visibility === void 0) { visibility = Visibility.visible; }
        var control = builderField.control, _a = builderField.visibility, v = _a === void 0 ? Visibility.visible : _a;
        if (control && v !== visibility) {
            var none = Visibility.none, disabled = Visibility.disabled, hidden = Visibility.hidden, readonly = Visibility.readonly;
            var isDisabled = [none, hidden, disabled, readonly].includes(visibility);
            isDisabled ? control.disable() : control.enable();
            visibility === none ? this.deleteValueToModel(binding) : this.setValueToModel(binding, control.value);
        }
    };
    FormExtension.prototype.excuteChangeEvent = function (jsonField, value) {
        var _a = this.getBuilderFieldById(jsonField.id).events, events = _a === void 0 ? {} : _a;
        return events[this.getEventType(this.getChangeType(jsonField))](value);
    };
    FormExtension.prototype.createNotifyChange = function (jsonField, _a) {
        var actionEvent = _a.actionEvent, builderField = _a.builderField;
        if (!actionEvent || actionEvent === builderField) {
            this.excuteChangeEvent(jsonField, this.getValueToModel(jsonField.binding));
        }
    };
    FormExtension.prototype.detectChanges = function (id) {
        var instance = this.builder.getFieldById(id).instance;
        instance === null || instance === void 0 ? void 0 : instance.detectChanges();
    };
    FormExtension.prototype.getChangeType = function (jsonField) {
        var _a = jsonField.binding.changeType, changeType = _a === void 0 ? this.defaultChangeType : _a;
        return jsonField.binding.changeType = changeType;
    };
    FormExtension.prototype.getValueToModel = function (binding) {
        return this.covertIntercept.toView(this.covertMap.get(binding), this.cache.viewModel.getBindValue(binding));
    };
    FormExtension.prototype.setValueToModel = function (binding, value) {
        this.cache.viewModel.setBindValue(binding, this.covertIntercept.toModel(this.covertMap.get(binding), value));
    };
    FormExtension.prototype.deleteValueToModel = function (binding) {
        this.cache.viewModel.deleteBindValue(binding);
    };
    FormExtension.prototype.isDomEvent = function (actionResult) {
        return actionResult && actionResult.target && !!actionResult.target.nodeType;
    };
    FormExtension.prototype.destory = function () {
        var _this = this;
        this.covertMap.clear();
        this.builderFields.forEach(function (builderField) {
            var _a;
            (_a = builderField.control) === null || _a === void 0 ? void 0 : _a.destory();
            _this.unDefineProperty(builderField, [CONTROL]);
        });
        return _super.prototype.destory.call(this);
    };
    return FormExtension;
}(BasicExtension));
export { FormExtension };

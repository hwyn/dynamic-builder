import { __extends, __spreadArray } from "tslib";
import { isEmpty } from 'lodash';
import { Visibility } from '../../builder';
import { FORM_CONTROL } from '../../token';
import { transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, CONTROL, LOAD_ACTION, NOTIFY_VIEW_MODEL_CHANGE } from '../constant/calculator.constant';
var FormExtension = /** @class */ (function (_super) {
    __extends(FormExtension, _super);
    function FormExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.builderFields = [];
        _this.defaultChangeType = CHANGE;
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
        var id = jsonField.id, updateOn = jsonField.updateOn, checkVisibility = jsonField.checkVisibility, validators = jsonField.validators;
        var changeType = this.getChangeType(jsonField);
        var builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField);
        this.pushCalculators(jsonField, __spreadArray(__spreadArray([{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField)),
                dependents: { type: LOAD_ACTION, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: NOTIFY_VIEW_MODEL_CHANGE, fieldId: builderId }
            }], checkVisibility ? [{
                action: this.bindCalculatorAction(this.createVisibility.bind(this)),
                dependents: { type: CHECK_VISIBILITY, fieldId: id }
            }] : [], true), validators ? [{
                action: this.bindCalculatorAction(this.createValidaity.bind(this)),
                dependents: { type: updateOn || changeType, fieldId: id }
            }] : [], true));
    };
    FormExtension.prototype.addChangeAction = function (changeType, jsonField) {
        var _a = jsonField.actions, actions = _a === void 0 ? [] : _a;
        var changeAction = actions.find(function (_a) {
            var type = _a.type;
            return type === changeType;
        });
        jsonField.actions = actions;
        !changeAction && actions.push(changeAction = { type: changeType });
        changeAction.after = this.bindCalculatorAction(this.createChange.bind(this, jsonField));
    };
    FormExtension.prototype.addControl = function (jsonField, builderField) {
        var value = this.getValueToModel(jsonField.binding, builderField);
        var control = this.injector.get(FORM_CONTROL, value, { builder: this.builder, builderField: builderField });
        this.defineProperty(builderField, CONTROL, control);
        delete builderField.field.binding;
        this.excuteChangeEvent(jsonField, value);
        this.changeVisibility(builderField, builderField.visibility);
    };
    FormExtension.prototype.createChange = function (_a, _b) {
        var _c, _d;
        var binding = _a.binding;
        var builderField = _b.builderField, actionEvent = _b.actionEvent;
        var value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.setValueToModel(binding, value, builderField);
        (_c = builderField.control) === null || _c === void 0 ? void 0 : _c.patchValue(value);
        (_d = builderField.instance) === null || _d === void 0 ? void 0 : _d.detectChanges();
    };
    FormExtension.prototype.createValidaity = function (_a) {
        var control = _a.builderField.control, ready = _a.builder.ready;
        return ready && transformObservable(control === null || control === void 0 ? void 0 : control.updateValueAndValidity());
    };
    FormExtension.prototype.createVisibility = function (_a) {
        var builderField = _a.builderField, ready = _a.builder.ready, actionEvent = _a.actionEvent;
        ready && this.changeVisibility(builderField, actionEvent);
    };
    FormExtension.prototype.changeVisibility = function (_a, visibility) {
        var control = _a.control;
        if (visibility === void 0) { visibility = Visibility.visible; }
        if (control) {
            var none = Visibility.none, disabled = Visibility.disabled, hidden = Visibility.hidden, readonly = Visibility.readonly;
            var isDisabled = [none, hidden, disabled, readonly].includes(visibility);
            isDisabled ? control.disable() : control.enable();
        }
    };
    FormExtension.prototype.excuteChangeEvent = function (jsonField, value) {
        var _a = this.getBuilderFieldById(jsonField.id).events, events = _a === void 0 ? {} : _a;
        return events[this.getEventType(this.getChangeType(jsonField))](value);
    };
    FormExtension.prototype.createNotifyChange = function (jsonField, _a) {
        var actionEvent = _a.actionEvent, builderField = _a.builderField;
        if (!actionEvent || actionEvent === builderField) {
            var binding = jsonField.binding;
            this.excuteChangeEvent(jsonField, this.getValueToModel(binding, builderField));
        }
    };
    FormExtension.prototype.getChangeType = function (jsonField) {
        var _a = jsonField.binding.changeType, changeType = _a === void 0 ? this.defaultChangeType : _a;
        return changeType;
    };
    FormExtension.prototype.getValueToModel = function (binding, builderField) {
        return this.cache.viewModel.getBindValue(binding, builderField);
    };
    FormExtension.prototype.setValueToModel = function (binding, value, builderField) {
        this.cache.viewModel.setBindValue(binding, value, builderField);
    };
    FormExtension.prototype.isDomEvent = function (actionResult) {
        return actionResult && actionResult.target && !!actionResult.target.nodeType;
    };
    FormExtension.prototype.destory = function () {
        var _this = this;
        this.builderFields.forEach(function (builderField) {
            var _a;
            (_a = builderField.control) === null || _a === void 0 ? void 0 : _a.destory();
            _this.defineProperty(builderField, CONTROL, null);
        });
        return _super.prototype.destory.call(this);
    };
    return FormExtension;
}(BasicExtension));
export { FormExtension };

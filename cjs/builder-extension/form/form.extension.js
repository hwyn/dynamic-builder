"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var builder_1 = require("../../builder");
var token_1 = require("../../token");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var FormExtension = /** @class */ (function (_super) {
    tslib_1.__extends(FormExtension, _super);
    function FormExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.convertMap = new Map();
        _this.builderFields = [];
        _this.defaultChangeType = calculator_constant_1.CHANGE;
        _this.getControl = _this.injector.get(token_1.FORM_CONTROL);
        _this.convertIntercept = _this.injector.get(token_1.CONVERT_INTERCEPT);
        return _this;
    }
    FormExtension.prototype.extension = function () {
        this.builderFields = this.mapFields(this.jsonFields.filter(function (_a) {
            var binding = _a.binding;
            return !(0, lodash_1.isEmpty)(binding);
        }), this.createMergeControl.bind(this));
    };
    FormExtension.prototype.createMergeControl = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        var changeType = this.getChangeType(jsonField);
        var id = jsonField.id, _b = jsonField.updateOn, updateOn = _b === void 0 ? changeType : _b, checkVisibility = jsonField.checkVisibility, validators = jsonField.validators;
        var builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField, builderField);
        this.pushCalculators(jsonField, tslib_1.__spreadArray(tslib_1.__spreadArray([{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField)),
                dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: calculator_constant_1.NOTIFY_MODEL_CHANGE, fieldId: builderId }
            }], checkVisibility ? [{
                action: this.bindCalculatorAction(this.createVisibility.bind(this, jsonField)),
                dependents: { type: calculator_constant_1.CHECK_VISIBILITY, fieldId: id }
            }] : [], true), validators && validators.length ? [{
                action: this.bindCalculatorAction(this.createValidity.bind(this)),
                dependents: this.toArray(updateOn).map(function (type) { return ({ type: type, fieldId: id }); })
            }] : [], true));
    };
    FormExtension.prototype.addChangeAction = function (changeType, jsonField, builderField) {
        var id = jsonField.id, _a = jsonField.actions, actions = _a === void 0 ? [] : _a, binding = jsonField.binding;
        var convert = binding.convert, _b = binding.intercept, intercept = _b === void 0 ? '' : _b;
        var actionIndex = actions.findIndex(function (_a) {
            var type = _a.type;
            return type === changeType;
        });
        var changeAfter = this.bindCalculatorAction(this.detectChanges.bind(this, id));
        var newAction = { type: changeType, after: changeAfter };
        var bindingAction = this.bindCalculatorAction(this.createChange.bind(this, jsonField));
        if (actions[actionIndex]) {
            bindingAction.after = this.bindCalculatorAction(actions[actionIndex]);
        }
        jsonField.actions = actions;
        newAction.before = intercept ? tslib_1.__assign(tslib_1.__assign({}, this.bindCalculatorAction(intercept)), { after: bindingAction }) : bindingAction;
        actionIndex === -1 ? actions.push(newAction) : actions[actionIndex] = newAction;
        this.convertMap.set(binding, this.convertIntercept.getConvertObj(convert, this.builder, builderField));
    };
    FormExtension.prototype.addControl = function (jsonField, builderField) {
        var binding = jsonField.binding;
        var value = this.getValueToModel(binding);
        var control = this.getControl(value, { builder: this.builder, builderField: builderField });
        this.defineProperty(builderField, calculator_constant_1.CONTROL, control);
        this.executeChangeEvent(jsonField, value);
        this.changeVisibility(builderField, binding, builderField.visibility);
        delete builderField.field.binding;
        delete builderField.field.updateOn;
    };
    FormExtension.prototype.createChange = function (_a, _b) {
        var _c;
        var binding = _a.binding;
        var builderField = _b.builderField, actionEvent = _b.actionEvent;
        var visibility = builderField.visibility;
        var value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.builder.showField(visibility) && this.setValueToModel(binding, value);
        (_c = builderField.control) === null || _c === void 0 ? void 0 : _c.patchValue(value);
        return actionEvent;
    };
    FormExtension.prototype.createValidity = function (_a) {
        var control = _a.builderField.control;
        control === null || control === void 0 ? void 0 : control.updateValueAndValidity();
    };
    FormExtension.prototype.createVisibility = function (_a, _b) {
        var binding = _a.binding;
        var builderField = _b.builderField, actionEvent = _b.actionEvent;
        var control = builderField.control, _c = builderField.visibility, visibility = _c === void 0 ? builder_1.Visibility.visible : _c;
        if (control && visibility !== actionEvent) {
            this.changeVisibility(builderField, binding, actionEvent);
        }
    };
    FormExtension.prototype.changeVisibility = function (builderField, binding, visibility) {
        if (visibility === void 0) { visibility = builder_1.Visibility.visible; }
        var control = builderField.control;
        var none = builder_1.Visibility.none, disabled = builder_1.Visibility.disabled, hidden = builder_1.Visibility.hidden, readonly = builder_1.Visibility.readonly;
        [none, hidden, disabled, readonly].includes(visibility) ? control.disable() : control.enable();
        this.builder.showField(visibility) ? this.setValueToModel(binding, control === null || control === void 0 ? void 0 : control.value) : this.deleteValueToModel(binding);
    };
    FormExtension.prototype.executeChangeEvent = function (jsonField, value) {
        var _a = this.getBuilderFieldById(jsonField.id).events, events = _a === void 0 ? {} : _a;
        return events[this.getEventType(this.getChangeType(jsonField))](value);
    };
    FormExtension.prototype.createNotifyChange = function (jsonField, _a) {
        var actionEvent = _a.actionEvent, builderField = _a.builderField;
        if (!actionEvent || actionEvent === builderField) {
            this.executeChangeEvent(jsonField, this.getValueToModel(jsonField.binding));
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
        var path = binding.path, initialValue = binding.default;
        return this.convertIntercept.toView(this.convertMap.get(binding), this.cache.viewModel.getBindValue(path, initialValue));
    };
    FormExtension.prototype.setValueToModel = function (binding, value) {
        this.cache.viewModel.setBindValue(binding.path, this.convertIntercept.toModel(this.convertMap.get(binding), value));
    };
    FormExtension.prototype.deleteValueToModel = function (binding) {
        this.cache.viewModel.deleteBindValue(binding.path);
    };
    FormExtension.prototype.isDomEvent = function (actionResult) {
        return actionResult && actionResult.target && !!actionResult.target.nodeType;
    };
    FormExtension.prototype.destroy = function () {
        var _this = this;
        this.convertMap.clear();
        this.builderFields.forEach(function (builderField) {
            var _a;
            if ((_a = builderField.control) === null || _a === void 0 ? void 0 : _a.destroy) {
                builderField.control.destroy();
            }
            _this.unDefineProperty(builderField, [calculator_constant_1.CONTROL]);
        });
        return _super.prototype.destroy.call(this);
    };
    return FormExtension;
}(basic_extension_1.BasicExtension));
exports.FormExtension = FormExtension;

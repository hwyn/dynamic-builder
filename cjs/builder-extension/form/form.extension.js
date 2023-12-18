"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormExtension = void 0;
var tslib_1 = require("tslib");
/* eslint-disable max-len */
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
        var builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField, builderField);
        this.pushCalculators(jsonField, [{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField), calculator_constant_1.CREATE_CONTROL),
                dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: calculator_constant_1.NOTIFY_MODEL_CHANGE, fieldId: builderId }
            },
            {
                action: this.bindCalculatorAction(this.createVisibility.bind(this, jsonField)),
                dependents: [
                    { type: calculator_constant_1.DESTROY, fieldId: jsonField.id },
                    { type: calculator_constant_1.CHECK_VISIBILITY, fieldId: jsonField.id }
                ]
            }]);
    };
    FormExtension.prototype.addChangeAction = function (changeType, jsonField, builderField) {
        var _a = jsonField.actions, actions = _a === void 0 ? [] : _a, binding = jsonField.binding;
        var convert = binding.convert, _b = binding.intercept, intercept = _b === void 0 ? '' : _b;
        var actionIndex = actions.findIndex(function (_a) {
            var type = _a.type;
            return type === changeType;
        });
        var newAction = actionIndex === -1 ? { type: changeType } : this.bindCalculatorAction(actions[actionIndex], changeType);
        var bindingAction = this.bindCalculatorAction(this.createChange.bind(this, jsonField));
        jsonField.actions = actions;
        newAction.after = this.bindCalculatorAction(this.detectChanges.bind(this, builderField));
        newAction.before = intercept ? tslib_1.__assign(tslib_1.__assign({}, this.bindCalculatorAction(intercept)), { after: bindingAction }) : bindingAction;
        actionIndex === -1 ? actions.push(newAction) : actions[actionIndex] = newAction;
        if (convert) {
            this.convertMap.set(binding, this.convertIntercept.getConvertObj(convert, this.builder, builderField));
        }
    };
    FormExtension.prototype.addControl = function (jsonField, builderField) {
        var binding = jsonField.binding;
        var value = this.getValueToModel(binding);
        var control = this.getControl(value, { builder: this.builder, builderField: builderField });
        this.defineProperty(builderField, calculator_constant_1.CONTROL, control);
        this.executeChangeEvent(jsonField, value);
        this.changeVisibility(builderField, binding, builderField.visibility);
        delete builderField.events[this.getEventType(calculator_constant_1.CREATE_CONTROL)];
        delete builderField.field.binding;
    };
    FormExtension.prototype.createChange = function (_a, _b) {
        var _c;
        var binding = _a.binding;
        var builderField = _b.builderField, actionEvent = _b.actionEvent;
        var value = this.isDomEvent(actionEvent) ? actionEvent.target.value : actionEvent;
        this.builder.showField(builderField.visibility) && this.setValueToModel(binding, value);
        (_c = builderField.control) === null || _c === void 0 ? void 0 : _c.patchValue(value);
        return actionEvent;
    };
    FormExtension.prototype.createVisibility = function (_a, _b) {
        var _c;
        var binding = _a.binding;
        var callLink = _b.callLink, builderField = _b.builderField, actionEvent = _b.actionEvent;
        var control = builderField.control, _d = builderField.visibility, visibility = _d === void 0 ? builder_1.Visibility.visible : _d;
        var _actionEvent = ((_c = callLink[0]) === null || _c === void 0 ? void 0 : _c.type) === calculator_constant_1.DESTROY ? builder_1.Visibility.none : actionEvent;
        if (control && visibility !== _actionEvent) {
            this.changeVisibility(builderField, binding, _actionEvent);
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
        var control = builderField.control;
        if ((!actionEvent || actionEvent === builderField) && control) {
            var value = this.getValueToModel(jsonField.binding);
            if (control.value !== value)
                this.executeChangeEvent(jsonField, value);
        }
    };
    FormExtension.prototype.detectChanges = function (_a) {
        var instance = _a.instance;
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
        binding.path && this.cache.viewModel.setBindValue(binding.path, this.convertIntercept.toModel(this.convertMap.get(binding), value));
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

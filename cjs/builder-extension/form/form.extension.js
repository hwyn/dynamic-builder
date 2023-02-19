"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var builder_1 = require("../../builder");
var token_1 = require("../../token");
var utility_1 = require("../../utility");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var FormExtension = /** @class */ (function (_super) {
    tslib_1.__extends(FormExtension, _super);
    function FormExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.builderFields = [];
        _this.defaultChangeType = calculator_constant_1.CHANGE;
        _this.getControl = _this.injector.get(token_1.FORM_CONTROL);
<<<<<<< HEAD
        _this.covertIntercept = _this.injector.get(token_1.COVERT_INTERCEPT);
=======
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
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
        var id = jsonField.id, updateOn = jsonField.updateOn, checkVisibility = jsonField.checkVisibility, validators = jsonField.validators;
        var changeType = this.getChangeType(jsonField);
        var builderId = this.builder.id;
        this.addChangeAction(changeType, jsonField, builderField);
        this.pushCalculators(jsonField, tslib_1.__spreadArray(tslib_1.__spreadArray([{
                action: this.bindCalculatorAction(this.addControl.bind(this, jsonField, builderField)),
                dependents: { type: calculator_constant_1.LOAD, fieldId: builderId }
            }, {
                action: this.bindCalculatorAction(this.createNotifyChange.bind(this, jsonField)),
                dependents: { type: calculator_constant_1.NOTIFY_MODEL_CHANGE, fieldId: builderId }
            }], checkVisibility ? [{
                action: this.bindCalculatorAction(this.createVisibility.bind(this, jsonField)),
                dependents: { type: calculator_constant_1.CHECK_VISIBILITY, fieldId: id }
            }] : [], true), validators && !validators.length ? [{
                action: this.bindCalculatorAction(this.createValidaity.bind(this)),
                dependents: { type: updateOn || changeType, fieldId: id }
            }] : [], true));
    };
<<<<<<< HEAD
    FormExtension.prototype.addChangeAction = function (changeType, jsonField, builderField) {
        var id = jsonField.id, _a = jsonField.actions, actions = _a === void 0 ? [] : _a, binding = jsonField.binding;
        var covert = binding.covert, _b = binding.intercept, intercept = _b === void 0 ? '' : _b;
=======
    FormExtension.prototype.addChangeAction = function (changeType, jsonField) {
        var _a = jsonField.actions, actions = _a === void 0 ? [] : _a, _b = jsonField.binding.intercept, intercept = _b === void 0 ? '' : _b;
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        var actionIndex = actions.findIndex(function (_a) {
            var type = _a.type;
            return type === changeType;
        });
<<<<<<< HEAD
        var changeAfter = this.bindCalculatorAction(this.detectChanges.bind(this, id));
        var replaceAction = { type: changeType, after: changeAfter };
=======
        var replaceAction = { type: changeType };
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        var bindingViewModel = tslib_1.__assign(tslib_1.__assign({}, this.bindCalculatorAction(this.createChange.bind(this, jsonField))), actions[actionIndex] ? { after: this.bindCalculatorAction(actions[actionIndex]) } : {});
        jsonField.actions = actions;
        replaceAction.before = intercept ? tslib_1.__assign(tslib_1.__assign({}, this.bindCalculatorAction(intercept)), { after: bindingViewModel }) : bindingViewModel;
        actionIndex === -1 ? actions.push(replaceAction) : actions[actionIndex] = replaceAction;
<<<<<<< HEAD
        this.defineProperty(binding, calculator_constant_1.COVERT, this.covertIntercept.getCovertObj(covert, this.builder, builderField));
=======
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
    };
    FormExtension.prototype.addControl = function (jsonField, builderField) {
        var binding = jsonField.binding;
        var value = this.getValueToModel(binding);
        var control = this.getControl(value, { builder: this.builder, builderField: builderField });
        this.defineProperty(builderField, calculator_constant_1.CONTROL, control);
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
        var _b = _a.builderField, control = _b.control, instance = _b.instance;
        return (0, utility_1.transformObservable)(control === null || control === void 0 ? void 0 : control.updateValueAndValidity()).pipe((0, rxjs_1.tap)(function () { return instance.detectChanges(); }));
    };
    FormExtension.prototype.createVisibility = function (_a, _b) {
        var binding = _a.binding;
        var builderField = _b.builderField, actionEvent = _b.actionEvent;
        this.changeVisibility(builderField, binding, actionEvent);
    };
    FormExtension.prototype.changeVisibility = function (builderField, binding, visibility) {
        if (visibility === void 0) { visibility = builder_1.Visibility.visible; }
<<<<<<< HEAD
        var control = builderField.control, _a = builderField.visibility, v = _a === void 0 ? builder_1.Visibility.visible : _a;
=======
        var control = builderField.control, v = builderField.visibility;
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        if (control && v !== visibility) {
            var none = builder_1.Visibility.none, disabled = builder_1.Visibility.disabled, hidden = builder_1.Visibility.hidden, readonly = builder_1.Visibility.readonly;
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
        return changeType;
    };
    FormExtension.prototype.getValueToModel = function (binding) {
<<<<<<< HEAD
        var value = this.cache.viewModel.getBindValue(binding);
        return this.covertIntercept.covertToView(binding.covert, value);
    };
    FormExtension.prototype.setValueToModel = function (binding, value) {
        value = this.covertIntercept.covertToModel(binding.covert, value);
=======
        return this.cache.viewModel.getBindValue(binding);
    };
    FormExtension.prototype.setValueToModel = function (binding, value) {
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
        this.cache.viewModel.setBindValue(binding, value);
    };
    FormExtension.prototype.deleteValueToModel = function (binding) {
        this.cache.viewModel.deleteBindValue(binding);
    };
    FormExtension.prototype.isDomEvent = function (actionResult) {
        return actionResult && actionResult.target && !!actionResult.target.nodeType;
    };
    FormExtension.prototype.destory = function () {
        var _this = this;
        this.builderFields.forEach(function (builderField) {
            var _a;
            (_a = builderField.control) === null || _a === void 0 ? void 0 : _a.destory();
            _this.unDefineProperty(builderField, [calculator_constant_1.CONTROL]);
            _this.unDefineProperty(_this.getJsonFieldById(builderField.id).binding, [calculator_constant_1.COVERT]);
        });
        return _super.prototype.destory.call(this);
    };
    return FormExtension;
}(basic_extension_1.BasicExtension));
exports.FormExtension = FormExtension;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleExtension = void 0;
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utility_1 = require("../../utility");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var LifeCycleExtension = /** @class */ (function (_super) {
    tslib_1.__extends(LifeCycleExtension, _super);
    function LifeCycleExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lifeEvent = [calculator_constant_1.LOAD, calculator_constant_1.CHANGE, calculator_constant_1.DESTROY];
        _this.calculators = [];
        _this.nonSelfCalculators = [];
        _this.parentDestroy = new rxjs_1.Subject();
        return _this;
    }
    LifeCycleExtension.prototype.extension = function () {
        this.cache.lifeType = tslib_1.__spreadArray(tslib_1.__spreadArray([], this.lifeEvent, true), this.cache.lifeType || [], true);
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLife.bind(this)),
            dependents: { type: calculator_constant_1.LOAD_CALCULATOR, fieldId: this.builder.id }
        });
        if (this.builder.parent)
            this.callParentDestroy(this.builder.parent);
    };
    LifeCycleExtension.prototype.callParentDestroy = function (parentBuilder) {
        var _this = this;
        var equal = function (_a) {
            var builder = _a.builder;
            return builder === parentBuilder;
        };
        this.cache.bindFn.push(function () { return _this.notifyParentDestroy(); });
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(function () { return _this.parentDestroy; }),
            dependents: { type: calculator_constant_1.DESTROY, fieldId: parentBuilder.id, equal: equal, nonSelf: true }
        });
    };
    LifeCycleExtension.prototype.createLifeChange = function () {
        var _a = this.json.actions, actions = _a === void 0 ? [] : _a;
        var lifeActions = this.lifeEvent.map(function (type) { return actions.find(function (action) { return action.type === type; }) || { type: type }; });
        var loadIndex = lifeActions.findIndex(function (_a) {
            var type = _a.type;
            return type === calculator_constant_1.LOAD;
        });
        var loadAction = { before: tslib_1.__assign(tslib_1.__assign({}, lifeActions[loadIndex]), { type: calculator_constant_1.LOAD_SOURCE }), type: calculator_constant_1.LOAD };
        loadIndex === -1 ? lifeActions.push(loadAction) : lifeActions[loadIndex] = loadAction;
        lifeActions.forEach(function (action) { return action.runObservable = true; });
        return lifeActions;
    };
    LifeCycleExtension.prototype.createLife = function () {
        this.lifeActions = this.createLifeActions(this.createLifeChange());
        this.defineProperty(this.builder, this.getEventType(calculator_constant_1.CHANGE), this.onLifeChange.bind(this, this.builder.onChange));
        return this.invokeLifeCycle(this.getEventType(calculator_constant_1.LOAD), this.props);
    };
    LifeCycleExtension.prototype.onLifeChange = function (onChange, props) {
        var _this = this;
        (0, utility_1.transformObservable)(onChange.call(this.builder, props)).pipe((0, utility_1.observableTap)(function () { return _this.invokeLifeCycle(_this.getEventType(calculator_constant_1.CHANGE), props); })).subscribe();
    };
    LifeCycleExtension.prototype.invokeLifeCycle = function (type, event, otherEvent) {
        return this.lifeActions[type] ? this.lifeActions[type](event, otherEvent) : (0, rxjs_1.of)(event);
    };
    LifeCycleExtension.prototype.notifyParentDestroy = function () {
        this.parentDestroy.next(this.builder.id);
        this.parentDestroy.complete();
        this.parentDestroy.unsubscribe();
        this.unDefineProperty(this, ['parentDestroy']);
    };
    LifeCycleExtension.prototype.beforeDestroy = function () {
        var _this = this;
        return this.invokeLifeCycle(this.getEventType(calculator_constant_1.DESTROY)).pipe((0, utility_1.observableMap)(function () { return (0, utility_1.transformObservable)(_super.prototype.beforeDestroy.call(_this)); }));
    };
    LifeCycleExtension.prototype.destroy = function () {
        var _this = this;
        this.unDefineProperty(this.builder, [this.getEventType(calculator_constant_1.CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType']);
        this.unDefineProperty(this, ['lifeActions']);
        return (0, utility_1.transformObservable)(_super.prototype.destroy.call(this)).pipe((0, operators_1.tap)(function () {
            var _a;
            var parentField = (_a = _this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(_this.builder.id);
            var instance = _this.props.instance || (parentField === null || parentField === void 0 ? void 0 : parentField.instance);
            if (instance && instance.current === _this.builder && !instance.destroy)
                instance.current = null;
        }));
    };
    return LifeCycleExtension;
}(basic_extension_1.BasicExtension));
exports.LifeCycleExtension = LifeCycleExtension;

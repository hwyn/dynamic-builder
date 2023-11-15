"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utility_1 = require("../../utility");
var basic_extension_1 = require("../basic/basic.extension");
// eslint-disable-next-line max-len
var calculator_constant_1 = require("../constant/calculator.constant");
var LifeCycleExtension = /** @class */ (function (_super) {
    tslib_1.__extends(LifeCycleExtension, _super);
    function LifeCycleExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lifeEvent = [calculator_constant_1.LOAD, calculator_constant_1.CHANGE, calculator_constant_1.DESTROY];
        _this.calculators = [];
        _this.nonSelfCalculators = [];
        return _this;
    }
    LifeCycleExtension.prototype.extension = function () {
        var nonSelfBuilders = this.builder.root.$$cache.nonSelfBuilders;
        this.defineProperty(this.cache, calculator_constant_1.NON_SELF_BUILDERS, nonSelfBuilders || []);
    };
    LifeCycleExtension.prototype.afterExtension = function () {
        this.serializeCalculators();
        return this.createLife();
    };
    LifeCycleExtension.prototype.createLoadAction = function (json) {
        var _a = json.actions, actions = _a === void 0 ? [] : _a;
        var loadIndex = actions.findIndex(function (_a) {
            var type = _a.type;
            return type === calculator_constant_1.LOAD;
        });
        var loadAction = { before: tslib_1.__assign(tslib_1.__assign({}, actions[loadIndex]), { type: calculator_constant_1.LOAD_SOURCE }), type: calculator_constant_1.LOAD };
        loadIndex === -1 ? actions.push(loadAction) : actions[loadIndex] = loadAction;
        return json;
    };
    LifeCycleExtension.prototype.createLife = function () {
        var _this = this;
        var actions = this.createLoadAction(this.json).actions;
        var lifeActionsType = actions.filter(function (_a) {
            var type = _a.type;
            return _this.lifeEvent.includes(type);
        });
        lifeActionsType.forEach(function (action) { return action.runObservable = true; });
        this.lifeActions = this.createLifeActions(lifeActionsType);
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
    LifeCycleExtension.prototype.serializeCalculators = function () {
        this.createCalculators();
        this.linkCalculators();
        this.bindCalculator();
    };
    LifeCycleExtension.prototype.linkCalculators = function () {
        var _this = this;
        this.cache.lifeType = tslib_1.__spreadArray(tslib_1.__spreadArray([], this.lifeEvent, true), this.cache.lifeType || [], true);
        this.calculators.forEach(function (calculator) { return _this.linkCalculator(calculator); });
        this.getNonSelfCalculators().forEach(function (calculator) { return _this.linkCalculator(calculator, true); });
        this.calculators = this.calculators.filter(function (c) { return !_this.nonSelfCalculators.includes(c); });
    };
    // eslint-disable-next-line complexity
    LifeCycleExtension.prototype.linkCalculator = function (calculator, nonSelfCalculator) {
        var _a = calculator.dependent, type = _a.type, fieldId = _a.fieldId, nonSelf = _a.nonSelf;
        var sourceField = this.getJsonFieldById(fieldId) || this.json;
        sourceField.actions = this.toArray(sourceField.actions || []);
        var _b = sourceField.actions, actions = _b === void 0 ? [] : _b, sourceId = sourceField.id;
        var isBuildCalculator = this.isBuildField(sourceField) && this.cache.lifeType.includes(type);
        var nonCalculator = nonSelf || isBuildCalculator || fieldId !== sourceId;
        if (nonCalculator && !nonSelfCalculator) {
            this.nonSelfCalculators.push(calculator);
            !isBuildCalculator && this.linkOtherCalculator(calculator);
        }
        if (!nonCalculator && !actions.some(function (action) { return action.type === type; })) {
            actions.unshift({ type: type });
        }
    };
    LifeCycleExtension.prototype.linkOtherCalculator = function (calculator) {
        var _a = calculator.dependent, type = _a.type, _b = _a.fieldId, fieldId = _b === void 0 ? '' : _b;
        var dependentFields = this.builder.root.getAllFieldById(fieldId);
        if (!(0, lodash_1.isEmpty)(dependentFields)) {
            dependentFields.forEach(function (dependentField) { return dependentField.addEventListener && dependentField.addEventListener({ type: type }); });
        }
    };
    LifeCycleExtension.prototype.createCalculators = function () {
        var _this = this;
        var fields = tslib_1.__spreadArray(tslib_1.__spreadArray([], this.jsonFields, true), [this.json], false);
        var fieldsWithCalculators = fields.filter(function (_a) {
            var calculators = _a.calculators;
            return !(0, lodash_1.isEmpty)(calculators);
        });
        this.calculators = [];
        this.cache.fields.forEach(function (_a) {
            var field = _a.field;
            return delete field.calculators;
        });
        fieldsWithCalculators.forEach(function (_a) {
            var targetId = _a.id, _b = _a.calculators, calculators = _b === void 0 ? [] : _b;
            _this.toArray(calculators).forEach(function (_a) {
                var action = _a.action, dependents = _a.dependents;
                _this.toArray(action).forEach(function (a) {
                    _this.toArray(dependents).forEach(function (dependent) {
                        _this.calculators.push({ targetId: targetId, action: _this.serializeAction(a), dependent: dependent });
                    });
                });
            });
        });
    };
    LifeCycleExtension.prototype.getNonSelfCalculators = function () {
        return (0, lodash_1.flatMap)(this.nonSelfBuilders.map(function (nonSelf) { return nonSelf.nonSelfCalculators; }));
    };
    Object.defineProperty(LifeCycleExtension.prototype, "nonSelfBuilders", {
        get: function () {
            return this.cache.nonSelfBuilders;
        },
        enumerable: false,
        configurable: true
    });
    LifeCycleExtension.prototype.bindCalculator = function () {
        var _a;
        this.builder.calculators = this.calculators;
        this.builder.nonSelfCalculators = this.nonSelfCalculators;
        this.defineProperties(this.cache, (_a = {}, _a[calculator_constant_1.ORIGIN_CALCULATORS] = this.calculators, _a[calculator_constant_1.ORIGIN_NON_SELF_CALCULATORS] = this.nonSelfCalculators, _a));
        this.nonSelfCalculators.length && this.nonSelfBuilders.push(this.builder);
    };
    LifeCycleExtension.prototype.beforeDestroy = function () {
        var _this = this;
        return this.invokeLifeCycle(this.getEventType(calculator_constant_1.DESTROY)).pipe((0, utility_1.observableMap)(function () { return (0, utility_1.transformObservable)(_super.prototype.beforeDestroy.call(_this)); }));
    };
    LifeCycleExtension.prototype.destroy = function () {
        var _this = this;
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        this.unDefineProperty(this.builder, ['calculators', 'nonSelfCalculators', this.getEventType(calculator_constant_1.CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType', calculator_constant_1.ORIGIN_CALCULATORS, calculator_constant_1.ORIGIN_NON_SELF_CALCULATORS, calculator_constant_1.NON_SELF_BUILDERS]);
        this.unDefineProperty(this, ['lifeActions']);
        return (0, utility_1.transformObservable)(_super.prototype.destroy.call(this)).pipe((0, operators_1.tap)(function () {
            var _a, _b;
            var parentField = (_a = _this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(_this.builder.id);
            var instance = (parentField || _this.props).instance;
            if (instance) {
                (_b = instance.destroy) === null || _b === void 0 ? void 0 : _b.next(_this.props.id || _this.builder.id);
                !instance.destroy && (instance.current = null);
            }
        }));
    };
    return LifeCycleExtension;
}(basic_extension_1.BasicExtension));
exports.LifeCycleExtension = LifeCycleExtension;

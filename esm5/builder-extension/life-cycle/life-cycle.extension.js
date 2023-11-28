import { __assign, __extends, __spreadArray } from "tslib";
import { flatMap, isEmpty } from 'lodash';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { observableMap, observableTap, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
// eslint-disable-next-line max-len
import { CHANGE, DESTROY, LOAD, LOAD_SOURCE, NON_SELF_BUILDERS, ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS } from '../constant/calculator.constant';
var LifeCycleExtension = /** @class */ (function (_super) {
    __extends(LifeCycleExtension, _super);
    function LifeCycleExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lifeEvent = [LOAD, CHANGE, DESTROY];
        _this.calculators = [];
        _this.nonSelfCalculators = [];
        return _this;
    }
    LifeCycleExtension.prototype.extension = function () {
        var nonSelfBuilders = this.builder.root.$$cache.nonSelfBuilders;
        this.defineProperty(this.cache, NON_SELF_BUILDERS, nonSelfBuilders || []);
    };
    LifeCycleExtension.prototype.afterExtension = function () {
        this.serializeCalculators();
        return this.createLife();
    };
    LifeCycleExtension.prototype.createLoadAction = function (json) {
        var _a = json.actions, actions = _a === void 0 ? [] : _a;
        var loadIndex = actions.findIndex(function (_a) {
            var type = _a.type;
            return type === LOAD;
        });
        var loadAction = { before: __assign(__assign({}, actions[loadIndex]), { type: LOAD_SOURCE }), type: LOAD };
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
        this.defineProperty(this.builder, this.getEventType(CHANGE), this.onLifeChange.bind(this, this.builder.onChange));
        return this.invokeLifeCycle(this.getEventType(LOAD), this.props);
    };
    LifeCycleExtension.prototype.onLifeChange = function (onChange, props) {
        var _this = this;
        transformObservable(onChange.call(this.builder, props)).pipe(observableTap(function () { return _this.invokeLifeCycle(_this.getEventType(CHANGE), props); })).subscribe();
    };
    LifeCycleExtension.prototype.invokeLifeCycle = function (type, event, otherEvent) {
        return this.lifeActions[type] ? this.lifeActions[type](event, otherEvent) : of(event);
    };
    LifeCycleExtension.prototype.serializeCalculators = function () {
        this.createCalculators();
        this.linkCalculators();
        this.bindCalculator();
    };
    LifeCycleExtension.prototype.linkCalculators = function () {
        var _this = this;
        this.cache.lifeType = __spreadArray(__spreadArray([], this.lifeEvent, true), this.cache.lifeType || [], true);
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
        var _this = this;
        var _a = calculator.dependent, type = _a.type, _b = _a.fieldId, fieldId = _b === void 0 ? '' : _b;
        var dependentFields = this.builder.root.getAllFieldById(fieldId).filter(function (_a) {
            var events = _a.events;
            return !events[_this.getEventType(type)];
        });
        if (!isEmpty(dependentFields)) {
            dependentFields.forEach(function (dependentField) { return dependentField.addEventListener && dependentField.addEventListener({ type: type }); });
        }
    };
    LifeCycleExtension.prototype.createCalculators = function () {
        var _this = this;
        var fields = __spreadArray(__spreadArray([], this.jsonFields, true), [this.json], false);
        var fieldsWithCalculators = fields.filter(function (_a) {
            var calculators = _a.calculators;
            return !isEmpty(calculators);
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
        return flatMap(this.nonSelfBuilders.map(function (nonSelf) { return nonSelf.nonSelfCalculators; }));
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
        this.defineProperties(this.cache, (_a = {}, _a[ORIGIN_CALCULATORS] = this.calculators, _a[ORIGIN_NON_SELF_CALCULATORS] = this.nonSelfCalculators, _a));
        this.nonSelfCalculators.length && this.nonSelfBuilders.push(this.builder);
    };
    LifeCycleExtension.prototype.beforeDestroy = function () {
        var _this = this;
        return this.invokeLifeCycle(this.getEventType(DESTROY)).pipe(observableMap(function () { return transformObservable(_super.prototype.beforeDestroy.call(_this)); }));
    };
    LifeCycleExtension.prototype.destroy = function () {
        var _this = this;
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        this.unDefineProperty(this.builder, ['calculators', 'nonSelfCalculators', this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType', ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS, NON_SELF_BUILDERS]);
        this.unDefineProperty(this, ['lifeActions']);
        return transformObservable(_super.prototype.destroy.call(this)).pipe(tap(function () {
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
}(BasicExtension));
export { LifeCycleExtension };

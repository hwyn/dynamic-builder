import { __assign, __extends, __spreadArray } from "tslib";
import { cloneDeep, flatMap, isEmpty } from 'lodash';
import { of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { observableMap, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
// eslint-disable-next-line max-len
import { CHANGE, DESTORY, LOAD, LOAD_SOURCE, NON_SELF_BUILSERS, ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS } from '../constant/calculator.constant';
var LifeCycleExtension = /** @class */ (function (_super) {
    __extends(LifeCycleExtension, _super);
    function LifeCycleExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasChange = false;
        _this.lifeEvent = [LOAD, CHANGE];
        _this.calculators = [];
        _this.nonSelfCalculators = [];
        _this.detectChanges = _this.cache.detectChanges.pipe(filter(function () { return !_this.hasChange; }));
        return _this;
    }
    LifeCycleExtension.prototype.extension = function () {
        var nonSelfBuilders = this.builder.root.$$cache.nonSelfBuilders;
        this.defineProperty(this.cache, NON_SELF_BUILSERS, nonSelfBuilders || []);
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
        var props = { builder: this.builder, id: this.builder.id };
        lifeActionsType.forEach(function (action) { return action.runObservable = true; });
        this.lifeActions = this.createActions(lifeActionsType, props, { injector: this.injector });
        this.defineProperty(this.builder, this.getEventType(CHANGE), this.onLifeChange.bind(this));
        return this.invokeLifeCycle(this.getEventType(LOAD), this.props);
    };
    LifeCycleExtension.prototype.onLifeChange = function (props) {
        this.hasChange = true;
        this.invokeLifeCycle(this.getEventType(CHANGE), props).subscribe();
        this.hasChange = false;
    };
    LifeCycleExtension.prototype.invokeLifeCycle = function (type, event, otherEvent) {
        var lifeActions = this.lifeActions;
        return lifeActions[type] ? lifeActions[type](event, otherEvent) : of(event);
    };
    LifeCycleExtension.prototype.serializeCalculators = function () {
        this.createCalculators();
        this.linkCalculators();
        this.bindCalculator();
    };
    LifeCycleExtension.prototype.linkCalculators = function () {
        var _this = this;
        this.calculators.forEach(function (calculator) { return _this.linkCalculator(calculator); });
        this.getNonSelfCalculators().forEach(function (calculator) { return _this.linkCalculator(calculator, true); });
    };
    LifeCycleExtension.prototype.linkCalculator = function (calculator, nonSelfCalculator) {
        var _a = calculator.dependent, type = _a.type, fieldId = _a.fieldId;
        var sourceField = this.getJsonFieldById(fieldId) || this.json;
        sourceField.actions = this.toArray(sourceField.actions || []);
        var _b = sourceField.actions, actions = _b === void 0 ? [] : _b, sourceId = sourceField.id;
        var nonSource = fieldId !== sourceId;
        if (nonSource && !nonSelfCalculator) {
            this.nonSelfCalculators.push(calculator);
            this.linkOtherCalculator(calculator);
        }
        if (!nonSource && !actions.some(function (action) { return action.type === type; })) {
            sourceField.actions.unshift({ type: type });
        }
    };
    LifeCycleExtension.prototype.linkOtherCalculator = function (calculator) {
        var _a = calculator.dependent, type = _a.type, _b = _a.fieldId, fieldId = _b === void 0 ? '' : _b;
        var otherFields = this.builder.root.getAllFieldById(fieldId);
        if (!isEmpty(otherFields)) {
            otherFields.forEach(function (otherField) { return otherField.addEventListener({ type: type }); });
        }
    };
    LifeCycleExtension.prototype.createCalculators = function () {
        var _this = this;
        var fields = __spreadArray(__spreadArray([], this.jsonFields, true), [this.json], false);
        var fieldsCalculators = cloneDeep(fields.filter(function (_a) {
            var calculators = _a.calculators;
            return !isEmpty(calculators);
        }));
        this.calculators = [];
        fieldsCalculators.forEach(function (_a) {
            var _b;
            var targetId = _a.id, _c = _a.calculators, calculators = _c === void 0 ? [] : _c;
            _this.toArray(calculators).forEach(function (_a) {
                var action = _a.action, dependents = _a.dependents;
                _this.toArray(dependents).forEach(function (dependent) {
                    _this.calculators.push({ targetId: targetId, action: _this.serializeAction(action), dependent: dependent });
                });
            });
            (_b = _this.getBuilderFieldById(targetId)) === null || _b === void 0 ? true : delete _b.field.calculators;
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
        this.builder.calculators = this.calculators;
        this.builder.nonSelfCalculators = this.nonSelfCalculators;
        this.defineProperty(this.cache, ORIGIN_CALCULATORS, this.calculators);
        this.defineProperty(this.cache, ORIGIN_NON_SELF_CALCULATORS, this.nonSelfCalculators);
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.push(this.builder);
        }
    };
    LifeCycleExtension.prototype.beforeDestory = function () {
        var _this = this;
        return this.invokeLifeCycle(this.getEventType(DESTORY)).pipe(observableMap(function () { return transformObservable(_super.prototype.beforeDestory.call(_this)); }));
    };
    LifeCycleExtension.prototype.destory = function () {
        var _this = this;
        var _a;
        if (this.nonSelfCalculators.length) {
            this.nonSelfBuilders.splice(this.nonSelfBuilders.indexOf(this.builder), 1);
        }
        this.unDefineProperty(this.builder, ['calculators', 'nonSelfCalculators', this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, [ORIGIN_CALCULATORS, ORIGIN_NON_SELF_CALCULATORS, NON_SELF_BUILSERS]);
        this.unDefineProperty(this, ['detectChanges', 'lifeActions']);
        var parentField = (_a = this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(this.builder.id);
        return transformObservable(_super.prototype.destory.call(this)).pipe(tap(function () { var _a; return parentField && ((_a = parentField.instance) === null || _a === void 0 ? void 0 : _a.destory.next(_this.builder.id)); }));
    };
    return LifeCycleExtension;
}(BasicExtension));
export { LifeCycleExtension };

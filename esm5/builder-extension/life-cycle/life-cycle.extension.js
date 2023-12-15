import { __assign, __extends, __spreadArray } from "tslib";
import { of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { observableMap, observableTap, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, DESTROY, LOAD, LOAD_CALCULATOR, LOAD_SOURCE } from '../constant/calculator.constant';
var LifeCycleExtension = /** @class */ (function (_super) {
    __extends(LifeCycleExtension, _super);
    function LifeCycleExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lifeEvent = [LOAD, CHANGE, DESTROY];
        _this.calculators = [];
        _this.nonSelfCalculators = [];
        _this.parentDestroy = new Subject();
        return _this;
    }
    LifeCycleExtension.prototype.extension = function () {
        this.cache.lifeType = __spreadArray(__spreadArray([], this.lifeEvent, true), this.cache.lifeType || [], true);
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLife.bind(this)),
            dependents: { type: LOAD_CALCULATOR, fieldId: this.builder.id }
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
            dependents: { type: DESTROY, fieldId: parentBuilder.id, equal: equal, nonSelf: true }
        });
    };
    LifeCycleExtension.prototype.getLifeActions = function () {
        var _a = this.json.actions, actions = _a === void 0 ? [] : _a;
        var lifeActions = this.lifeEvent.map(function (type) { return actions.find(function (action) { return action.type === type; }) || { type: type }; });
        var loadIndex = lifeActions.findIndex(function (_a) {
            var type = _a.type;
            return type === LOAD;
        });
        var loadAction = { before: __assign(__assign({}, lifeActions[loadIndex]), { type: LOAD_SOURCE }), type: LOAD };
        loadIndex === -1 ? lifeActions.push(loadAction) : lifeActions[loadIndex] = loadAction;
        lifeActions.forEach(function (action) { return action.runObservable = true; });
        return lifeActions;
    };
    LifeCycleExtension.prototype.createLife = function () {
        this.lifeActions = this.createLifeActions(this.getLifeActions());
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
    LifeCycleExtension.prototype.notifyParentDestroy = function () {
        this.parentDestroy.next(this.builder.id);
        this.parentDestroy.complete();
        this.parentDestroy.unsubscribe();
        this.unDefineProperty(this, ['parentDestroy']);
    };
    LifeCycleExtension.prototype.beforeDestroy = function () {
        var _this = this;
        return this.invokeLifeCycle(this.getEventType(DESTROY)).pipe(observableMap(function () { return transformObservable(_super.prototype.beforeDestroy.call(_this)); }));
    };
    LifeCycleExtension.prototype.destroy = function () {
        var _this = this;
        this.unDefineProperty(this.builder, [this.getEventType(CHANGE)]);
        this.unDefineProperty(this.cache, ['lifeType']);
        this.unDefineProperty(this, ['lifeActions']);
        return transformObservable(_super.prototype.destroy.call(this)).pipe(tap(function () {
            var _a;
            var parentField = (_a = _this.builder.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(_this.builder.id);
            var instance = _this.props.instance || (parentField === null || parentField === void 0 ? void 0 : parentField.instance);
            if (instance && instance.current === _this.builder && !instance.destroy)
                instance.current = null;
        }));
    };
    return LifeCycleExtension;
}(BasicExtension));
export { LifeCycleExtension };

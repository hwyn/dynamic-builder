import { __assign, __extends, __spreadArray } from "tslib";
import { of } from 'rxjs';
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
        return _this;
    }
    LifeCycleExtension.prototype.extension = function () {
        this.cache.lifeType = __spreadArray(__spreadArray([], this.lifeEvent, true), this.cache.lifeType || [], true);
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLife.bind(this)),
            dependents: { type: LOAD_CALCULATOR, fieldId: this.builder.id }
        });
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

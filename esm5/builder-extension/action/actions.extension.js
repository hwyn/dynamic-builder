import { __assign, __extends, __spreadArray } from "tslib";
import { isEmpty, isPlainObject } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { ADD_EVENT_LISTENER, EVENTS, LOAD_ACTION, LOAD_VIEW_MODEL } from '../constant/calculator.constant';
var CACHE_ACTION = 'cacheAction';
var ActionExtension = /** @class */ (function (_super) {
    __extends(ActionExtension, _super);
    function ActionExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fields = [];
        return _this;
    }
    ActionExtension.prototype.beforeExtension = function () {
        var _this = this;
        __spreadArray([this.json], this.jsonFields, true).forEach(function (jsonField) { return jsonField.actions = _this.parseActions(jsonField.actions); });
    };
    ActionExtension.prototype.parseActions = function (actions) {
        var _this = this;
        if (!Array.isArray(actions) && isPlainObject(actions)) {
            return Object.keys(actions).map(function (key) { return _this.bindCalculatorAction(actions[key], key); });
        }
        return actions;
    };
    ActionExtension.prototype.extension = function () {
        var handler = this.eachFields.bind(this, this.jsonFields, this.create.bind(this));
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(handler, LOAD_ACTION),
            dependents: { type: LOAD_VIEW_MODEL, fieldId: this.builder.id }
        });
    };
    ActionExtension.prototype.create = function (_a) {
        var _b;
        var jsonField = _a[0], builderField = _a[1];
        var _c = jsonField.actions, actions = _c === void 0 ? [] : _c;
        this.defineProperties(builderField, (_b = {}, _b[ADD_EVENT_LISTENER] = this.addFieldEvent.bind(this, builderField), _b[CACHE_ACTION] = [], _b));
        if (!isEmpty(actions))
            builderField.addEventListener(actions);
        this.fields.push(builderField);
        delete builderField.field.actions;
    };
    ActionExtension.prototype.addFieldEvent = function (builderField, actions) {
        var _this = this;
        var _a = builderField.events, events = _a === void 0 ? {} : _a, id = builderField.id;
        var addActions = this.toArray(actions).filter(function (_a) {
            var type = _a.type;
            return !events[_this.getEventType(type)];
        });
        if (!isEmpty(addActions)) {
            var addEvents = this.createActions(this.toArray(addActions), { builder: this.builder, id: id }, { injector: this.injector });
            this.defineProperty(builderField, EVENTS, __assign(__assign({}, events), addEvents));
            builderField.instance.detectChanges();
        }
    };
    ActionExtension.prototype.destroy = function () {
        var _this = this;
        this.fields.forEach(function (field) { return _this.unDefineProperty(field, [CACHE_ACTION, EVENTS, ADD_EVENT_LISTENER]); });
        _super.prototype.destroy.call(this);
    };
    return ActionExtension;
}(BasicExtension));
export { ActionExtension };

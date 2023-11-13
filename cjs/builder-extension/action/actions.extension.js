"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var CACHE_ACTION = 'cacheAction';
var ActionExtension = /** @class */ (function (_super) {
    tslib_1.__extends(ActionExtension, _super);
    function ActionExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fields = [];
        return _this;
    }
    ActionExtension.prototype.beforeExtension = function () {
        var _this = this;
        tslib_1.__spreadArray([this.json], this.jsonFields, true).forEach(function (jsonField) { return jsonField.actions = _this.parseActions(jsonField.actions); });
    };
    ActionExtension.prototype.parseActions = function (actions) {
        var _this = this;
        if (!Array.isArray(actions) && (0, lodash_1.isPlainObject)(actions)) {
            return Object.keys(actions).map(function (key) { return _this.bindCalculatorAction(actions[key], key); });
        }
        return actions;
    };
    ActionExtension.prototype.extension = function () {
        var handler = this.eachFields.bind(this, this.jsonFields, this.create.bind(this));
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(handler, calculator_constant_1.LOAD_ACTION),
            dependents: { type: calculator_constant_1.LOAD_VIEW_MODEL, fieldId: this.builder.id }
        });
    };
    ActionExtension.prototype.create = function (_a) {
        var _b;
        var jsonField = _a[0], builderField = _a[1];
        var _c = jsonField.actions, actions = _c === void 0 ? [] : _c;
        this.defineProperties(builderField, (_b = {}, _b[calculator_constant_1.ADD_EVENT_LISTENER] = this.addFieldEvent.bind(this, builderField), _b[CACHE_ACTION] = [], _b));
        if (!(0, lodash_1.isEmpty)(actions))
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
        if (!(0, lodash_1.isEmpty)(addActions)) {
            var addEvents = this.createActions(this.toArray(addActions), { builder: this.builder, id: id }, { injector: this.injector });
            this.defineProperty(builderField, calculator_constant_1.EVENTS, tslib_1.__assign(tslib_1.__assign({}, events), addEvents));
            builderField.instance.detectChanges();
        }
    };
    ActionExtension.prototype.destroy = function () {
        var _this = this;
        this.fields.forEach(function (field) { return _this.unDefineProperty(field, [CACHE_ACTION, calculator_constant_1.EVENTS, calculator_constant_1.ADD_EVENT_LISTENER]); });
        _super.prototype.destroy.call(this);
    };
    return ActionExtension;
}(basic_extension_1.BasicExtension));
exports.ActionExtension = ActionExtension;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeExtension = void 0;
var tslib_1 = require("tslib");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var AttributeExtension = /** @class */ (function (_super) {
    tslib_1.__extends(AttributeExtension, _super);
    function AttributeExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inherent = [calculator_constant_1.LAYOUT];
        return _this;
    }
    AttributeExtension.prototype.extension = function () {
        var _this = this;
        this.eachFields(this.jsonFields, function (_a) {
            var jsonField = _a[0], builderField = _a[1];
            Object.keys(builderField.field).forEach(function (key) {
                if (/^#([\w\d]+)/ig.test(key))
                    _this.addCalculator(key, jsonField, builderField);
            });
        });
    };
    AttributeExtension.prototype.addCalculator = function (key, jsonField, builderField) {
        var defaultDependents = { type: calculator_constant_1.LOAD, fieldId: this.builder.id };
        var _a = this.serializeCalculatorConfig(jsonField[key], calculator_constant_1.CALCULATOR, defaultDependents), action = _a.action, dependents = _a.dependents;
        action.after = this.bindCalculatorAction(this.updateAttr.bind(this, key));
        this.pushCalculators(jsonField, { action: action, dependents: dependents });
        delete builderField.field[key];
    };
    AttributeExtension.prototype.updateAttr = function (key, _a) {
        var builderField = _a.builderField, actionEvent = _a.actionEvent, instance = _a.instance;
        var _key = key.replace(/^#([\w\d]+)/ig, '$1');
        if (this.inherent.includes(_key)) {
            this.defineProperty(builderField, _key, actionEvent);
            this.builder.detectChanges();
        }
        else {
            builderField.field[_key] = actionEvent;
            instance.detectChanges();
        }
    };
    return AttributeExtension;
}(basic_extension_1.BasicExtension));
exports.AttributeExtension = AttributeExtension;

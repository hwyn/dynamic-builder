import { __extends } from "tslib";
import { BasicExtension } from '../basic/basic.extension';
import { CALCULATOR, LAYOUT, LOAD } from '../constant/calculator.constant';
var AttributeExtension = /** @class */ (function (_super) {
    __extends(AttributeExtension, _super);
    function AttributeExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inherent = [LAYOUT];
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
        var defaultDependents = { type: LOAD, fieldId: this.builder.id };
        var _a = this.serializeCalculatorConfig(jsonField[key], CALCULATOR, defaultDependents), action = _a.action, dependents = _a.dependents;
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
}(BasicExtension));
export { AttributeExtension };

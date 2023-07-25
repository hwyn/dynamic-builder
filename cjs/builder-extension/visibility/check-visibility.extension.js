"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckVisibilityExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
function getParentVisibility(builder) {
    var _a;
    var id = builder.id, parent = builder.parent;
    return parent && ((_a = parent.getFieldById(id)) === null || _a === void 0 ? void 0 : _a.visibility);
}
var CheckVisibilityExtension = /** @class */ (function (_super) {
    tslib_1.__extends(CheckVisibilityExtension, _super);
    function CheckVisibilityExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckVisibilityExtension.prototype.extension = function () {
        var visibilityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        this.pushActionToMethod({ type: calculator_constant_1.REFRESH_VISIBILITY });
        if (!(0, lodash_1.isEmpty)(visibilityList)) {
            this.eachFields(visibilityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.removeOnEvent),
                    dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: this.builder.id }
                }]);
        }
    };
    CheckVisibilityExtension.prototype.createDependents = function (types) {
        var _this = this;
        return types.map(function (type) { return ({ type: type, fieldId: _this.builder.id }); });
    };
    CheckVisibilityExtension.prototype.addFieldCalculators = function (_a) {
        var jsonField = _a[0], field = _a[1].field;
        var _b = this.serializeCheckVisibilityConfig(jsonField), action = _b.action, dependents = _b.dependents;
        action.after = this.bindCalculatorAction(this.checkVisibilityAfter(jsonField.visibility));
        this.pushCalculators(jsonField, [{ action: action, dependents: dependents }]);
        delete field.checkVisibility;
    };
    CheckVisibilityExtension.prototype.serializeCheckVisibilityConfig = function (jsonField) {
        var jsonCheckVisibility = jsonField.checkVisibility;
        return this.serializeCalculatorConfig(jsonCheckVisibility, calculator_constant_1.CHECK_VISIBILITY, this.createDependents([calculator_constant_1.LOAD, calculator_constant_1.REFRESH_VISIBILITY]));
    };
    CheckVisibilityExtension.prototype.checkVisibilityAfter = function (defaultVisibility) {
        return function (_a) {
            var _b = _a.actionEvent, actionEvent = _b === void 0 ? defaultVisibility : _b, builderField = _a.builderField, builder = _a.builder;
            if (builderField.visibility !== actionEvent) {
                builderField.visibility = actionEvent;
                builder.ready && builder.detectChanges();
            }
        };
    };
    CheckVisibilityExtension.prototype.removeOnEvent = function (_a) {
        var builder = _a.builder;
        builder.$$cache.fields.forEach(function (field) {
            field.onCheckVisibility = field.events.onCheckVisibility;
            delete field.events.onCheckVisibility;
        });
    };
    CheckVisibilityExtension.prototype.checkNeedOrDefaultVisibility = function (jsonField) {
        var visibility = jsonField.visibility, checkVisibility = jsonField.checkVisibility;
        var needCheck = !(0, lodash_1.isUndefined)(checkVisibility || visibility) || getParentVisibility(this.builder);
        if (needCheck && !checkVisibility) {
            jsonField.checkVisibility = function (_a) {
                var builder = _a.builder;
                return visibility || getParentVisibility(builder);
            };
        }
        return needCheck;
    };
    CheckVisibilityExtension.prototype.destroy = function () {
        this.unDefineProperty(this.builder, [calculator_constant_1.REFRESH_VISIBILITY]);
        return _super.prototype.destroy.call(this);
    };
    return CheckVisibilityExtension;
}(basic_extension_1.BasicExtension));
exports.CheckVisibilityExtension = CheckVisibilityExtension;

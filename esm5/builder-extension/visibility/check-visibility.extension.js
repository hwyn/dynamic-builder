import { __extends } from "tslib";
import { isEmpty } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHECK_VISIBILITY, LOAD, LOAD_ACTION, REFRESH_VISIBILITY } from '../constant/calculator.constant';
var CheckVisibilityExtension = /** @class */ (function (_super) {
    __extends(CheckVisibilityExtension, _super);
    function CheckVisibilityExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckVisibilityExtension.prototype.extension = function () {
        var visibilityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        this.pushActionToMethod({ type: REFRESH_VISIBILITY });
        if (!isEmpty(visibilityList)) {
            this.eachFields(visibilityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.removeOnEvent),
                    dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
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
        var checkVisibility = jsonField.checkVisibility;
        return this.serializeCalculatorConfig(checkVisibility, CHECK_VISIBILITY, this.createDependents([LOAD, REFRESH_VISIBILITY]));
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
        builder.$$cache.fields.forEach(function (_a) {
            var events = _a.events;
            return delete events.onCheckVisibility;
        });
    };
    CheckVisibilityExtension.prototype.checkNeedOrDefaultVisibility = function (jsonField) {
        var _a, _b;
        var visibility = jsonField.visibility, checkVisibility = jsonField.checkVisibility;
        if (checkVisibility || visibility) {
            return checkVisibility;
        }
        var parent = this.builder.parent;
        var parentField = parent && ((_b = parent.getFieldById((_a = this.builder) === null || _a === void 0 ? void 0 : _a.id)) === null || _b === void 0 ? void 0 : _b.fieldConfig);
        if (parentField === null || parentField === void 0 ? void 0 : parentField.visibility) {
            this.getBuilderFieldById(jsonField.id).visibility = parentField === null || parentField === void 0 ? void 0 : parentField.visibility;
        }
        if (parentField === null || parentField === void 0 ? void 0 : parentField.checkVisibility) {
            jsonField.checkVisibility = {
                action: function (_a) {
                    var actionEvent = _a.actionEvent;
                    return actionEvent;
                },
                dependents: { fieldId: parentField.id, type: CHECK_VISIBILITY, nonSelf: true }
            };
        }
        return jsonField.checkVisibility;
    };
    CheckVisibilityExtension.prototype.destroy = function () {
        this.unDefineProperty(this.builder, [REFRESH_VISIBILITY]);
        return _super.prototype.destroy.call(this);
    };
    return CheckVisibilityExtension;
}(BasicExtension));
export { CheckVisibilityExtension };

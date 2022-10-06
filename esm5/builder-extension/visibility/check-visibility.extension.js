import { __extends } from "tslib";
import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, LOAD, LOAD_ACTION } from '../constant/calculator.constant';
var CheckVisibilityExtension = /** @class */ (function (_super) {
    __extends(CheckVisibilityExtension, _super);
    function CheckVisibilityExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultDependents = [LOAD, CHANGE].map(function (type) { return ({ type: type, fieldId: _this.builder.id }); });
        return _this;
    }
    CheckVisibilityExtension.prototype.extension = function () {
        var visibliityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        if (!isEmpty(visibliityList)) {
            this.builderFields = this.mapFields(visibliityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.checkVisibility.bind(this, {})),
                    dependents: this.defaultDependents
                }, {
                    action: this.bindCalculatorAction(this.removeOnEvent.bind(this)),
                    dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
                }]);
        }
    };
    CheckVisibilityExtension.prototype.addFieldCalculators = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        var _b = this.serializeCheckVisibilityConfig(jsonField), action = _b.action, dependents = _b.dependents;
        action.after = this.bindCalculatorAction(this.checkVisibilityAfter.bind(this));
        this.pushCalculators(jsonField, [{ action: action, dependents: dependents }]);
        delete builderField.field.checkVisibility;
        return builderField;
    };
    CheckVisibilityExtension.prototype.serializeCheckVisibilityConfig = function (jsonField) {
        var jsonCheckVisibility = jsonField.checkVisibility;
        return this.serializeCalculatorConfig(jsonCheckVisibility, CHECK_VISIBILITY, this.defaultDependents);
    };
    CheckVisibilityExtension.prototype.checkVisibilityAfter = function (_a) {
        var actionEvent = _a.actionEvent, builderField = _a.builderField, builder = _a.builder;
        if (actionEvent && builderField.visibility !== actionEvent) {
            builderField.visibility = actionEvent;
            builder.detectChanges();
        }
    };
    CheckVisibilityExtension.prototype.removeOnEvent = function () {
        this.builderFields.forEach(function (_a) {
            var _b = _a.events, events = _b === void 0 ? {} : _b;
            return delete events.onCheckVisibility;
        });
    };
    CheckVisibilityExtension.prototype.checkVisibility = function (cache) {
        var _this = this;
        var ids = cache.ids;
        var _a = this.cache, fields = _a.fields, ready = _a.ready;
        var hiddenList = fields.filter(function (_a) {
            var visibility = _a.visibility;
            return !_this.builder.showField(visibility);
        }).map(function (_a) {
            var id = _a.id;
            return id;
        });
        var newIds = hiddenList.join('');
        if (ids !== newIds && ready) {
            cache.ids = newIds;
            this.builder.calculators = this.filterNoneCalculators(this.cache.originCalculators, hiddenList);
            this.builder.$$cache.nonSelfBuilders.forEach(function (nonBuild) {
                nonBuild.nonSelfCalculators = _this.filterNoneCalculators(nonBuild.$$cache.originNonSelfCalculators, hiddenList);
            });
        }
    };
    CheckVisibilityExtension.prototype.filterNoneCalculators = function (originCalculators, hiddenList) {
        return originCalculators.filter(function (_a) {
            var targetId = _a.targetId, type = _a.action.type, dType = _a.dependent.type;
            return type === CHECK_VISIBILITY || dType === CHECK_VISIBILITY || !hiddenList.includes(targetId);
        });
    };
    CheckVisibilityExtension.prototype.checkNeedOrDefaultVisibility = function (jsonField) {
        var _this = this;
        var visibility = jsonField.visibility, checkVisibility = jsonField.checkVisibility;
        var isCheck = !isUndefined(checkVisibility || visibility) || this.getParentVisibility();
        if (isCheck && !checkVisibility) {
            jsonField.checkVisibility = function () { return visibility || _this.getParentVisibility(); };
        }
        return isCheck;
    };
    CheckVisibilityExtension.prototype.getParentVisibility = function () {
        var _a = this.builder, id = _a.id, parent = _a.parent;
        return parent && parent.getFieldById(id).visibility;
    };
    return CheckVisibilityExtension;
}(BasicExtension));
export { CheckVisibilityExtension };

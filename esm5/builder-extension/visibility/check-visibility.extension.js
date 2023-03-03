import { __extends } from "tslib";
import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, LOAD, LOAD_ACTION, REFRESH_VISIBILITY } from '../constant/calculator.constant';
function filterNoneCalculators(originCalculators, hiddenList) {
    return originCalculators.filter(function (_a) {
        var targetId = _a.targetId, type = _a.action.type, dType = _a.dependent.type;
        return !hiddenList.includes(targetId) || [type, dType].includes(CHECK_VISIBILITY);
    });
}
function getParentVisibility(builder) {
    var _a;
    var id = builder.id, parent = builder.parent;
    return parent && ((_a = parent.getFieldById(id)) === null || _a === void 0 ? void 0 : _a.visibility);
}
export function createCheckVisibility() {
    var cache = {};
    return function (_a) {
        var builder = _a.builder;
        var ids = cache.ids;
        var $$cache = builder.$$cache;
        var fields = $$cache.fields, ready = $$cache.ready;
        var hiddenList = fields.filter(function (_a) {
            var visibility = _a.visibility;
            return !builder.showField(visibility);
        }).map(function (_a) {
            var id = _a.id;
            return id;
        });
        var newIds = hiddenList.join('');
        if (ids !== newIds && ready) {
            cache.ids = newIds;
            builder.calculators = filterNoneCalculators($$cache.originCalculators, hiddenList);
            $$cache.nonSelfBuilders.forEach(function (nonBuild) {
                nonBuild.nonSelfCalculators = filterNoneCalculators(nonBuild.$$cache.originNonSelfCalculators, hiddenList);
            });
        }
    };
}
var CheckVisibilityExtension = /** @class */ (function (_super) {
    __extends(CheckVisibilityExtension, _super);
    function CheckVisibilityExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckVisibilityExtension.prototype.extension = function () {
        var visibliityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        this.pushActionToMethod({ type: REFRESH_VISIBILITY });
        if (!isEmpty(visibliityList)) {
            this.eachFields(visibliityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(createCheckVisibility()),
                    dependents: this.createDependents([LOAD, CHANGE])
                }, {
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
        action.after = this.bindCalculatorAction(this.checkVisibilityAfter);
        this.pushCalculators(jsonField, [{ action: action, dependents: dependents }]);
        delete field.checkVisibility;
    };
    CheckVisibilityExtension.prototype.serializeCheckVisibilityConfig = function (jsonField) {
        var jsonCheckVisibility = jsonField.checkVisibility;
        return this.serializeCalculatorConfig(jsonCheckVisibility, CHECK_VISIBILITY, this.createDependents([LOAD, REFRESH_VISIBILITY]));
    };
    CheckVisibilityExtension.prototype.checkVisibilityAfter = function (_a) {
        var actionEvent = _a.actionEvent, builderField = _a.builderField, builder = _a.builder;
        if (actionEvent && builderField.visibility !== actionEvent) {
            builderField.visibility = actionEvent;
            builder.ready && builder.detectChanges();
        }
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
        var isCheck = !isUndefined(checkVisibility || visibility) || getParentVisibility(this.builder);
        if (isCheck && !checkVisibility) {
            jsonField.checkVisibility = function (_a) {
                var builder = _a.builder;
                return visibility || getParentVisibility(builder);
            };
        }
        return isCheck;
    };
    CheckVisibilityExtension.prototype.destory = function () {
        this.unDefineProperty(this.builder, [REFRESH_VISIBILITY]);
        return _super.prototype.destory.call(this);
    };
    return CheckVisibilityExtension;
}(BasicExtension));
export { CheckVisibilityExtension };

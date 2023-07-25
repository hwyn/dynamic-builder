import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHECK_VISIBILITY, LOAD, LOAD_ACTION, REFRESH_VISIBILITY } from '../constant/calculator.constant';
function getParentVisibility(builder) {
    var _a;
    const { id, parent } = builder;
    return parent && ((_a = parent.getFieldById(id)) === null || _a === void 0 ? void 0 : _a.visibility);
}
export class CheckVisibilityExtension extends BasicExtension {
    extension() {
        const visibilityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        this.pushActionToMethod({ type: REFRESH_VISIBILITY });
        if (!isEmpty(visibilityList)) {
            this.eachFields(visibilityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.removeOnEvent),
                    dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
                }]);
        }
    }
    createDependents(types) {
        return types.map((type) => ({ type, fieldId: this.builder.id }));
    }
    addFieldCalculators([jsonField, { field }]) {
        const { action, dependents } = this.serializeCheckVisibilityConfig(jsonField);
        action.after = this.bindCalculatorAction(this.checkVisibilityAfter(jsonField.visibility));
        this.pushCalculators(jsonField, [{ action, dependents }]);
        delete field.checkVisibility;
    }
    serializeCheckVisibilityConfig(jsonField) {
        const { checkVisibility: jsonCheckVisibility } = jsonField;
        return this.serializeCalculatorConfig(jsonCheckVisibility, CHECK_VISIBILITY, this.createDependents([LOAD, REFRESH_VISIBILITY]));
    }
    checkVisibilityAfter(defaultVisibility) {
        return ({ actionEvent = defaultVisibility, builderField, builder }) => {
            if (builderField.visibility !== actionEvent) {
                builderField.visibility = actionEvent;
                builder.ready && builder.detectChanges();
            }
        };
    }
    removeOnEvent({ builder }) {
        builder.$$cache.fields.forEach((field) => {
            field.onCheckVisibility = field.events.onCheckVisibility;
            delete field.events.onCheckVisibility;
        });
    }
    checkNeedOrDefaultVisibility(jsonField) {
        const { visibility, checkVisibility } = jsonField;
        const needCheck = !isUndefined(checkVisibility || visibility) || getParentVisibility(this.builder);
        if (needCheck && !checkVisibility) {
            jsonField.checkVisibility = ({ builder }) => visibility || getParentVisibility(builder);
        }
        return needCheck;
    }
    destroy() {
        this.unDefineProperty(this.builder, [REFRESH_VISIBILITY]);
        return super.destroy();
    }
}

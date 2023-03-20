import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, LOAD, LOAD_ACTION, REFRESH_VISIBILITY } from '../constant/calculator.constant';
function filterNoneCalculators(originCalculators, hiddenList) {
    return originCalculators.filter(({ targetId, action: { type }, dependent: { type: dType } }) => {
        return !hiddenList.includes(targetId) || [type, dType].includes(CHECK_VISIBILITY);
    });
}
function getParentVisibility(builder) {
    var _a;
    const { id, parent } = builder;
    return parent && ((_a = parent.getFieldById(id)) === null || _a === void 0 ? void 0 : _a.visibility);
}
export function createCheckVisibility() {
    const cache = {};
    return ({ builder }) => {
        const { ids } = cache;
        const $$cache = builder.$$cache;
        const { fields, ready } = $$cache;
        const hiddenList = fields.filter(({ visibility }) => !builder.showField(visibility)).map(({ id }) => id);
        const newIds = hiddenList.join('');
        if (ids !== newIds && ready) {
            cache.ids = newIds;
            builder.calculators = filterNoneCalculators($$cache.originCalculators, hiddenList);
            $$cache.nonSelfBuilders.forEach((nonBuild) => {
                nonBuild.nonSelfCalculators = filterNoneCalculators(nonBuild.$$cache.originNonSelfCalculators, hiddenList);
            });
        }
    };
}
export class CheckVisibilityExtension extends BasicExtension {
    extension() {
        const visibilityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        this.pushActionToMethod({ type: REFRESH_VISIBILITY });
        if (!isEmpty(visibilityList)) {
            this.eachFields(visibilityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(createCheckVisibility()),
                    dependents: this.createDependents([LOAD, CHANGE])
                }, {
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
        action.after = this.bindCalculatorAction(this.checkVisibilityAfter);
        this.pushCalculators(jsonField, [{ action, dependents }]);
        delete field.checkVisibility;
    }
    serializeCheckVisibilityConfig(jsonField) {
        const { checkVisibility: jsonCheckVisibility } = jsonField;
        return this.serializeCalculatorConfig(jsonCheckVisibility, CHECK_VISIBILITY, this.createDependents([LOAD, REFRESH_VISIBILITY]));
    }
    checkVisibilityAfter({ actionEvent, builderField, builder }) {
        if (actionEvent && builderField.visibility !== actionEvent) {
            builderField.visibility = actionEvent;
            builder.ready && builder.detectChanges();
        }
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

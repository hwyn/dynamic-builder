import { isEmpty } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHECK_VISIBILITY, LOAD, LOAD_ACTION, REFRESH_VISIBILITY } from '../constant/calculator.constant';
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
        const { checkVisibility } = jsonField;
        return this.serializeCalculatorConfig(checkVisibility, CHECK_VISIBILITY, this.createDependents([LOAD, REFRESH_VISIBILITY]));
    }
    checkVisibilityAfter(defaultVisibility) {
        return ({ actionEvent = defaultVisibility, builderField, builder }) => {
            // const { instance } = builderField;
            if (builderField.visibility !== actionEvent) {
                builderField.visibility = actionEvent;
                // if (instance.current instanceof BuilderModel) {
                //   (instance.current as BuilderModelExtensions).refreshVisibility();
                // }
                builder.ready && builder.detectChanges();
            }
        };
    }
    removeOnEvent({ builder: { $$cache: { fields = [] } } }) {
        fields.forEach(({ events }) => delete events.onCheckVisibility);
    }
    checkNeedOrDefaultVisibility(jsonField) {
        // const { parent } = this.builder;
        // const { visibility, checkVisibility } = jsonField;
        // if (checkVisibility || visibility || !parent) {
        //   return checkVisibility;
        // }
        // const parentField = parent.$$cache.fieldsConfig.find(({ id }: any) => id === this.builder.id);
        // if (parentField?.visibility) {
        //   this.getBuilderFieldById(jsonField.id).visibility = parentField?.visibility;
        // }
        // if (parentField?.checkVisibility) {
        //   jsonField.checkVisibility = ({ builder }: BaseAction) => builder.parent?.getFieldById(builder.id)?.visibility
        // }
        return jsonField.checkVisibility;
    }
    destroy() {
        this.unDefineProperty(this.builder, [REFRESH_VISIBILITY]);
        return super.destroy();
    }
}

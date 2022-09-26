import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, LOAD, LOAD_ACTION } from '../constant/calculator.constant';
export class CheckVisibilityExtension extends BasicExtension {
    builderFields;
    defaultDependents = [LOAD, CHANGE].map((type) => ({ type, fieldId: this.builder.id }));
    extension() {
        const visibliityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
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
    }
    addFieldCalculators([jsonField, builderField]) {
        const { action, dependents } = this.serializeCheckVisibilityConfig(jsonField);
        action.after = this.bindCalculatorAction(this.checkVisibilityAfter.bind(this));
        this.pushCalculators(jsonField, [{ action, dependents }]);
        delete builderField.field.checkVisibility;
        return builderField;
    }
    serializeCheckVisibilityConfig(jsonField) {
        const { checkVisibility: jsonCheckVisibility } = jsonField;
        return this.serializeCalculatorConfig(jsonCheckVisibility, CHECK_VISIBILITY, this.defaultDependents);
    }
    checkVisibilityAfter({ actionEvent, builderField, builder }) {
        if (actionEvent && builderField.visibility !== actionEvent) {
            builderField.visibility = actionEvent;
            builder.detectChanges();
        }
    }
    removeOnEvent() {
        this.builderFields.forEach(({ events = {} }) => delete events.onCheckVisibility);
    }
    checkVisibility(cache) {
        const { ids } = cache;
        const { fields, ready } = this.cache;
        const hiddenList = fields.filter(({ visibility }) => !this.builder.showField(visibility)).map(({ id }) => id);
        const newIds = hiddenList.join('');
        if (ids !== newIds && ready) {
            cache.ids = newIds;
            this.builder.calculators = this.filterNoneCalculators(this.cache.originCalculators, hiddenList);
            this.builder.$$cache.nonSelfBuilders.forEach((nonBuild) => {
                nonBuild.nonSelfCalculators = this.filterNoneCalculators(nonBuild.$$cache.originNonSelfCalculators, hiddenList);
            });
        }
    }
    filterNoneCalculators(originCalculators, hiddenList) {
        return originCalculators.filter(({ targetId, action: { type }, dependent: { type: dType } }) => {
            return type === CHECK_VISIBILITY || dType === CHECK_VISIBILITY || !hiddenList.includes(targetId);
        });
    }
    checkNeedOrDefaultVisibility(jsonField) {
        const { visibility, checkVisibility } = jsonField;
        const isCheck = !isUndefined(checkVisibility || visibility) || this.getParentVisibility();
        if (isCheck && !checkVisibility) {
            jsonField.checkVisibility = () => visibility || this.getParentVisibility();
        }
        return isCheck;
    }
    getParentVisibility() {
        const { id, parent } = this.builder;
        return parent && parent.getFieldById(id).visibility;
    }
}

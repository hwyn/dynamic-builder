import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { CHANGE, CHECK_VISIBILITY, LOAD, LOAD_ACTION, REFRESH_VISIBILITY } from '../constant/calculator.constant';
export class CheckVisibilityExtension extends BasicExtension {
    extension() {
        const visibliityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        this.pushActionToMethod({ type: REFRESH_VISIBILITY });
        if (!isEmpty(visibliityList)) {
            this.builderFields = this.mapFields(visibliityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.checkVisibility.bind(this, {})),
                    dependents: this.createDependents([LOAD, CHANGE])
                }, {
                    action: this.bindCalculatorAction(this.removeOnEvent.bind(this)),
                    dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
                }]);
        }
    }
    createDependents(types) {
        return types.map((type) => ({ type, fieldId: this.builder.id }));
    }
    addFieldCalculators([jsonField, { field }]) {
        const { action, dependents } = this.serializeCheckVisibilityConfig(jsonField);
        action.after = this.bindCalculatorAction(this.checkVisibilityAfter.bind(this));
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
            return !hiddenList.includes(targetId) || [type, dType].includes(CHECK_VISIBILITY);
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
        var _a;
        const { id, parent } = this.builder;
        return parent && ((_a = parent.getFieldById(id)) === null || _a === void 0 ? void 0 : _a.visibility);
    }
    destory() {
        this.unDefineProperty(this.builder, [REFRESH_VISIBILITY]);
        return super.destory();
    }
}

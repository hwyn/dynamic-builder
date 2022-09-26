"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckVisibilityExtension = void 0;
const lodash_1 = require("lodash");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
class CheckVisibilityExtension extends basic_extension_1.BasicExtension {
    builderFields;
    defaultDependents = [calculator_constant_1.LOAD, calculator_constant_1.CHANGE].map((type) => ({ type, fieldId: this.builder.id }));
    extension() {
        const visibliityList = this.jsonFields.filter(this.checkNeedOrDefaultVisibility.bind(this));
        if (!(0, lodash_1.isEmpty)(visibliityList)) {
            this.builderFields = this.mapFields(visibliityList, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.checkVisibility.bind(this, {})),
                    dependents: this.defaultDependents
                }, {
                    action: this.bindCalculatorAction(this.removeOnEvent.bind(this)),
                    dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: this.builder.id }
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
        return this.serializeCalculatorConfig(jsonCheckVisibility, calculator_constant_1.CHECK_VISIBILITY, this.defaultDependents);
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
            return type === calculator_constant_1.CHECK_VISIBILITY || dType === calculator_constant_1.CHECK_VISIBILITY || !hiddenList.includes(targetId);
        });
    }
    checkNeedOrDefaultVisibility(jsonField) {
        const { visibility, checkVisibility } = jsonField;
        const isCheck = !(0, lodash_1.isUndefined)(checkVisibility || visibility) || this.getParentVisibility();
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
exports.CheckVisibilityExtension = CheckVisibilityExtension;

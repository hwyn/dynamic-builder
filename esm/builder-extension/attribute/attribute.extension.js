import { BasicExtension } from '../basic/basic.extension';
import { CALCULATOR, LAYOUT, LOAD } from '../constant/calculator.constant';
export class AttributeExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.inherent = [LAYOUT];
    }
    extension() {
        this.eachFields(this.jsonFields, ([jsonField, builderField]) => {
            Object.keys(builderField.field).forEach((key) => {
                if (/^#([\w\d]+)/ig.test(key))
                    this.addCalculator(key, jsonField, builderField);
            });
        });
    }
    addCalculator(key, jsonField, builderField) {
        const defaultDependents = { type: LOAD, fieldId: this.builder.id };
        const { action, dependents } = this.serializeCalculatorConfig(jsonField[key], CALCULATOR, defaultDependents);
        action.after = this.bindCalculatorAction(this.updateAttr.bind(this, key));
        this.pushCalculators(jsonField, { action, dependents });
        delete builderField.field[key];
    }
    updateAttr(key, { builderField, actionEvent, instance }) {
        const _key = key.replace(/^#([\w\d]+)/ig, '$1');
        if (this.inherent.includes(_key)) {
            this.defineProperty(builderField, _key, actionEvent);
            this.builder.detectChanges();
        }
        else {
            builderField.field[_key] = actionEvent;
            instance.detectChanges();
        }
    }
}

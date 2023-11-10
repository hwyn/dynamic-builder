import { merge } from 'lodash';
import { GRID_PARSE, LAYOUT_ELEMENT } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { ELEMENT, GRID, LAYOUT, LAYOUT_FIELD, LOAD_SOURCE } from '../constant/calculator.constant';
const defaultLayout = { container: 'default', column: 12, group: 1 };
export class GridExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.getGrid = this.injector.get(GRID_PARSE);
        this.getLayoutElement = this.injector.get(LAYOUT_ELEMENT);
    }
    extension() {
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLoadGrid.bind(this)),
            dependents: { type: LOAD_SOURCE, fieldId: this.builder.id }
        });
    }
    createLoadGrid() {
        this.defineProperty(this.cache, GRID, this.getGrid(this.json, this.builder));
        this.layoutBuildFields = this.mapFields(this.jsonFields, this.addFieldLayout.bind(this, {}));
        this.defineProperty(this.builder, ELEMENT, this.getLayoutElement(this.cache.grid, this.builder));
        this.builderFields = this.mapFields(this.jsonFields.filter(({ type }) => type === LAYOUT_FIELD), this.addLayoutElement.bind(this));
    }
    addLayoutElement([jsonField, builderField]) {
        if (!builderField.element) {
            builderField.element = this.getLayoutElement(this.getGrid(jsonField, this.builder), this.builder);
            delete builderField.field.grid;
        }
    }
    addFieldLayout(cursor, [, builderField]) {
        const { field, field: { layout = {} } } = builderField;
        const mergeLayout = merge(this.cloneDeepPlain(defaultLayout), layout);
        const { container, group, row } = mergeLayout;
        cursor[container] = cursor[container] || {};
        cursor[container][group] = row || cursor[container][group] || 1;
        this.defineProperty(builderField, LAYOUT, merge({ row: cursor[container][group] }, mergeLayout));
        delete field.layout;
    }
    destroy() {
        this.cache.grid.destroy();
        this.defineProperty(this.cache, GRID, null);
        this.defineProperty(this.builder, ELEMENT, null);
        this.layoutBuildFields.forEach((builderField) => this.defineProperty(builderField, LAYOUT, null));
        this.builderFields.forEach((builderField) => delete builderField.element);
        return super.destroy();
    }
}

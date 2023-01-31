import { cloneDeep, merge } from 'lodash';
import { LAYOUT_ELEMENT } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { ELEMENT, GRID, LAYOUT, LOAD_SOURCE } from '../constant/calculator.constant';
import { Grid } from './grid';
const defaultLayout = { column: 12, group: 1 };
export class GridExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.getLayoutElement = this.injector.get(LAYOUT_ELEMENT);
    }
    extension() {
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLoadGrid.bind(this)),
            dependents: { type: LOAD_SOURCE, fieldId: this.builder.id }
        });
    }
    createLoadGrid() {
        this.defineProperty(this.cache, GRID, new Grid(this.builder, this.json));
        this.layoutBuildFields = this.mapFields(this.jsonFields, this.addFieldLayout.bind(this, {}));
        this.defineProperty(this.builder, ELEMENT, this.getLayoutElement(this.cache.grid, this.builder));
    }
    addFieldLayout(cursor, [, builderField]) {
        const { field, field: { layout = {} } } = builderField;
        const mergeLayout = merge(cloneDeep(defaultLayout), layout);
        const { row, group } = mergeLayout;
        cursor[group] = row || cursor[group] || 1;
        this.defineProperty(builderField, LAYOUT, merge({ row: cursor[group] }, mergeLayout));
        delete field.layout;
    }
    destory() {
        this.defineProperty(this.cache, GRID, null);
        this.defineProperty(this.builder, ELEMENT, null);
        this.layoutBuildFields.forEach((builderField) => this.defineProperty(builderField, LAYOUT, null));
        return super.destory();
    }
}

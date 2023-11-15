import { merge } from 'lodash';
import { GRID_PARSE, LAYOUT_ELEMENT } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { ELEMENT, GRID, GRID_ELEMENT, LAYOUT, LAYOUT_FIELD, LOAD_SOURCE } from '../constant/calculator.constant';
const defaultLayout = { column: 12, group: 1 };
export class GridExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.builderFields = [];
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
    }
    addLayoutElement([jsonField, builderField]) {
        const grid = this.getGrid(jsonField, this.builder);
        const gridElement = this.getLayoutElement(grid, this.builder);
        if (grid.config.container === this.builder.$$cache.grid.config.container) {
            throw new Error(`${jsonField.id} container is error`);
        }
        if (jsonField.type === LAYOUT_FIELD) {
            builderField.element = gridElement;
        }
        else {
            this.defineProperties(builderField, { [GRID]: grid, [GRID_ELEMENT]: gridElement });
        }
        this.builderFields.push(builderField);
        delete builderField.field.grid;
    }
    addFieldLayout(cursor, [jsonField, builderField]) {
        const { field, field: { layout = {} } } = builderField;
        const mergeLayout = merge(this.cloneDeepPlain(defaultLayout), layout);
        const { container = '__m__', group, row } = mergeLayout;
        cursor[container] = cursor[container] || {};
        cursor[container][group] = row || cursor[container][group] || 1;
        this.defineProperty(builderField, LAYOUT, merge({ row: cursor[container][group] }, mergeLayout));
        if (jsonField.grid || jsonField.type === LAYOUT_FIELD)
            this.addLayoutElement([jsonField, builderField]);
        delete field.layout;
    }
    destroy() {
        this.cache.grid.destroy();
        this.defineProperty(this.cache, GRID, null);
        this.defineProperty(this.builder, ELEMENT, null);
        this.layoutBuildFields.forEach((builderField) => this.defineProperty(builderField, LAYOUT, null));
        this.builderFields.forEach((builderField) => {
            var _a;
            (_a = builderField.grid) === null || _a === void 0 ? void 0 : _a.destroy();
            this.unDefineProperty(builderField, [GRID, GRID_ELEMENT, 'element']);
        });
        return super.destroy();
    }
}

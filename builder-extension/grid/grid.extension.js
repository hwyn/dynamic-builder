import { cloneDeep, groupBy, merge } from 'lodash';
import { BIND_BUILDER_ELEMENT } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { ELEMENT, GRID, LATOUT_ID, LAYOUT, LOAD } from '../constant/calculator.constant';
const defaultLayout = { column: 12, group: 1 };
const defaultGrid = {
    spacing: 0,
    justify: 'flex-start',
    alignItems: 'flex-start',
    groups: [12]
};
export class GridExtension extends BasicExtension {
    layoutBuildFields;
    extension() {
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLoadGrid.bind(this)),
            dependents: { type: LOAD, fieldId: this.builder.id }
        });
    }
    createLoadGrid() {
        this.defineProperty(this.cache, GRID, this.createGrid());
        this.layoutBuildFields = this.mapFields(this.jsonFields, this.addFieldLayout.bind(this, {}));
        this.defineProperty(this.builder, ELEMENT, this.ls.getProvider(BIND_BUILDER_ELEMENT, this.cache.grid));
    }
    addFieldLayout(cursor, [, builderField]) {
        const { field, field: { layout } } = builderField;
        const mergeLayout = merge(cloneDeep(defaultLayout), layout || {});
        const { row, group } = mergeLayout;
        cursor[group] = row || cursor[group] || 1;
        this.defineProperty(builderField, LAYOUT, merge({ row: cursor[group] }, mergeLayout));
        delete field.layout;
    }
    createGrid() {
        const { grid } = this.json;
        const { id = LATOUT_ID, groups, additional = [], ...other } = merge(cloneDeep(defaultGrid), grid);
        const { justify, alignItems, spacing } = other;
        const groupLayout = groupBy(additional, ({ group }) => group);
        const defaultGroupAdditional = { justify, alignItems, spacing };
        const groupAdditional = groups.map((xs, index) => {
            const [item = {}] = groupLayout[index + 1] || [];
            return { xs, ...defaultGroupAdditional, ...item };
        });
        return { id, ...other, additional: groupAdditional };
    }
    destory() {
        this.defineProperty(this.cache, GRID, null);
        this.defineProperty(this.builder, ELEMENT, null);
        this.layoutBuildFields.forEach((builderField) => this.defineProperty(builderField, LAYOUT, null));
        return super.destory();
    }
}

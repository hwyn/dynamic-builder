import { __rest } from "tslib";
import { groupBy, merge, toArray } from 'lodash';
import { cloneDeepPlain } from '../../utility';
import { LAYOUT_ID } from '../constant/calculator.constant';
const defaultGrid = {
    spacing: 0,
    justify: 'flex-start',
    alignItems: 'flex-start',
    groups: [12]
};
function groupByFields(fields) {
    return groupBy(fields, ({ layout: { group = 1 } }) => group);
}
function groupFieldsToArray(fields) {
    return toArray(groupBy(fields, ({ layout: { row } }) => row));
}
export class Grid {
    constructor(json, builder) {
        this.builder = builder;
        this.config = this.serializationConfig(json.grid);
    }
    serializationConfig(gridConfig) {
        const _a = merge(cloneDeepPlain(defaultGrid), gridConfig), { id = LAYOUT_ID, groups, additional = [] } = _a, other = __rest(_a, ["id", "groups", "additional"]);
        const { justify, alignItems, spacing } = other;
        const groupLayout = groupBy(additional, ({ group }) => group);
        const defaultGroupAdditional = { justify, alignItems, spacing };
        const groupAdditional = groups.map((xs, index) => {
            const [item = {}] = groupLayout[index + 1] || [];
            return Object.assign(Object.assign({ xs }, defaultGroupAdditional), item);
        });
        return Object.assign(Object.assign({ id }, other), { additional: groupAdditional });
    }
    getViewGrip(props) {
        const config = cloneDeepPlain(this.config);
        const { additional = [], className = '', style } = config;
        const { className: propsClassName = '', style: propsStyle } = props;
        const groupLayout = groupByFields(this.builder.fields);
        config.additional = additional.filter((item, group) => {
            item.fieldRows = groupFieldsToArray(groupLayout[group + 1]);
            return !!item.fieldRows.length;
        });
        if (className || propsClassName) {
            config.className = [className, propsClassName].join(' ');
        }
        if (style || propsStyle) {
            config.style = Object.assign({}, style, propsStyle);
        }
        return config;
    }
    destroy() {
        delete this.builder;
    }
}

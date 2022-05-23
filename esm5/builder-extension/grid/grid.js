import { cloneDeep, groupBy, merge, toArray } from 'lodash';
import { LATOUT_ID } from '../constant/calculator.constant';
const defaultGrid = {
    spacing: 0,
    justify: 'flex-start',
    alignItems: 'flex-start',
    groups: [12]
};
function groupByFields(fields) {
    return groupBy(fields, ({ layout: { group } }) => group);
}
function groupFieldsToArray(fields) {
    return toArray(groupBy(fields, ({ layout: { row } }) => row));
}
export class Grid {
    builder;
    config;
    constructor(builder, json) {
        this.builder = builder;
        this.config = this.serializationConfig(json.grid);
    }
    serializationConfig(gridConfig) {
        const { id = LATOUT_ID, groups, additional = [], ...other } = merge(cloneDeep(defaultGrid), gridConfig);
        const { justify, alignItems, spacing } = other;
        const groupLayout = groupBy(additional, ({ group }) => group);
        const defaultGroupAdditional = { justify, alignItems, spacing };
        const groupAdditional = groups.map((xs, index) => {
            const [item = {}] = groupLayout[index + 1] || [];
            return { xs, ...defaultGroupAdditional, ...item };
        });
        return { id, ...other, additional: groupAdditional };
    }
    getViewGrip(props) {
        const config = cloneDeep(this.config);
        const { additional = [], className = '', style } = config;
        const { className: propsClassName = '', style: propsStyle } = props;
        const groupLayout = groupByFields(this.builder.fields);
        additional.forEach((item, group) => item.fieldRows = groupFieldsToArray(groupLayout[group + 1]));
        if (className || propsClassName) {
            config.className = [className, propsClassName].join(' ');
        }
        if (style || propsStyle) {
            config.style = Object.assign({}, style, propsStyle);
        }
        return config;
    }
}

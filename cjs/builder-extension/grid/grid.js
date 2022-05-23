"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const lodash_1 = require("lodash");
const calculator_constant_1 = require("../constant/calculator.constant");
const defaultGrid = {
    spacing: 0,
    justify: 'flex-start',
    alignItems: 'flex-start',
    groups: [12]
};
function groupByFields(fields) {
    return (0, lodash_1.groupBy)(fields, ({ layout: { group } }) => group);
}
function groupFieldsToArray(fields) {
    return (0, lodash_1.toArray)((0, lodash_1.groupBy)(fields, ({ layout: { row } }) => row));
}
class Grid {
    builder;
    config;
    constructor(builder, json) {
        this.builder = builder;
        this.config = this.serializationConfig(json.grid);
    }
    serializationConfig(gridConfig) {
        const { id = calculator_constant_1.LATOUT_ID, groups, additional = [], ...other } = (0, lodash_1.merge)((0, lodash_1.cloneDeep)(defaultGrid), gridConfig);
        const { justify, alignItems, spacing } = other;
        const groupLayout = (0, lodash_1.groupBy)(additional, ({ group }) => group);
        const defaultGroupAdditional = { justify, alignItems, spacing };
        const groupAdditional = groups.map((xs, index) => {
            const [item = {}] = groupLayout[index + 1] || [];
            return { xs, ...defaultGroupAdditional, ...item };
        });
        return { id, ...other, additional: groupAdditional };
    }
    getViewGrip(props) {
        const config = (0, lodash_1.cloneDeep)(this.config);
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
exports.Grid = Grid;

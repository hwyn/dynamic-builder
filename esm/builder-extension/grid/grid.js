import { __rest } from "tslib";
import { groupBy, toArray } from 'lodash';
import { cloneDeepPlain } from '../../utility';
import { LAYOUT_ID } from '../constant/calculator.constant';
const defaultGrid = { spacing: 0, justify: 'flex-start', alignItems: 'flex-start', groups: [12] };
function groupByFields(fields) {
    return groupBy(fields, ({ layout: { group = 1 } }) => group);
}
function groupFieldsToArray(fields) {
    return toArray(groupBy(fields, ({ layout: { row } }) => row));
}
export class Grid {
    static create(json, builder) {
        return new Grid(json, builder);
    }
    constructor(json, builder) {
        this.builder = builder;
        this.config = this.serializationConfig(json.grid);
    }
    serializationConfig(gridConfig) {
        const _a = Object.assign(Object.assign({}, defaultGrid), gridConfig), { id = LAYOUT_ID, groups, additional = [] } = _a, other = __rest(_a, ["id", "groups", "additional"]);
        const { justify, alignItems, spacing } = other;
        const groupLayout = groupBy(additional, ({ group }) => group);
        const defaultGroupAdditional = { justify, alignItems, spacing };
        const groupAdditional = groups.map((xs, index) => {
            var _a;
            const [item = {}] = (_a = groupLayout[index + 1]) !== null && _a !== void 0 ? _a : [];
            return Object.assign(Object.assign({ xs }, defaultGroupAdditional), item);
        });
        return Object.assign(Object.assign({ id }, other), { additional: groupAdditional });
    }
    getViewGrid(props) {
        const config = cloneDeepPlain(this.config);
        const builderContainerId = this.builder.$$cache.grid.config.container;
        const { additional = [], container: configContainer = builderContainerId, className = '', style } = config;
        const { className: propsClassName = '', style: propsStyle } = props;
        const fields = this.builder.fields.filter(({ layout: { container } }) => container === configContainer);
        const groupLayout = groupByFields(fields);
        config.additional = additional.filter((item, group) => {
            return !!(item.fieldRows = groupFieldsToArray(groupLayout[group + 1])).length;
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

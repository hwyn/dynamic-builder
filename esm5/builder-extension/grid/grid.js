import { __assign, __rest } from "tslib";
import { groupBy, toArray } from 'lodash';
import { cloneDeepPlain } from '../../utility';
import { LAYOUT_ID } from '../constant/calculator.constant';
var defaultGrid = { spacing: 0, justify: 'flex-start', alignItems: 'flex-start', groups: [12] };
function groupByFields(fields) {
    return groupBy(fields, function (_a) {
        var _b = _a.layout.group, group = _b === void 0 ? 1 : _b;
        return group;
    });
}
function groupFieldsToArray(fields) {
    return toArray(groupBy(fields, function (_a) {
        var row = _a.layout.row;
        return row;
    }));
}
var Grid = /** @class */ (function () {
    function Grid(json, builder) {
        this.builder = builder;
        this.config = this.serializationConfig(json.id, json.grid);
    }
    Grid.create = function (json, builder) {
        return new Grid(json, builder);
    };
    Grid.prototype.serializationConfig = function (container, gridConfig) {
        var _a = Object.assign(__assign({}, defaultGrid), gridConfig), _b = _a.id, id = _b === void 0 ? LAYOUT_ID : _b, groups = _a.groups, _c = _a.additional, additional = _c === void 0 ? [] : _c, other = __rest(_a, ["id", "groups", "additional"]);
        var justify = other.justify, alignItems = other.alignItems, spacing = other.spacing;
        var groupLayout = groupBy(additional, function (_a) {
            var group = _a.group;
            return group;
        });
        var defaultGroupAdditional = { justify: justify, alignItems: alignItems, spacing: spacing };
        var groupAdditional = groups.map(function (xs, index) {
            var _a;
            var _b = ((_a = groupLayout[index + 1]) !== null && _a !== void 0 ? _a : [])[0], item = _b === void 0 ? {} : _b;
            return __assign(__assign({ xs: xs }, defaultGroupAdditional), item);
        });
        return __assign(__assign({ id: id, container: container }, other), { additional: groupAdditional });
    };
    Grid.prototype.getViewGrid = function (props) {
        var config = cloneDeepPlain(this.config);
        var _a = config.additional, additional = _a === void 0 ? [] : _a, gridContainer = config.container, _b = config.className, className = _b === void 0 ? '' : _b, style = config.style;
        var _c = props.className, propsClassName = _c === void 0 ? '' : _c, propsStyle = props.style;
        var fields = this.builder.fields.filter(function (_a) {
            var container = _a.layout.container;
            return container === gridContainer;
        });
        var groupLayout = groupByFields(fields);
        config.additional = additional.filter(function (item, group) {
            return !!(item.fieldRows = groupFieldsToArray(groupLayout[group + 1])).length;
        });
        if (className || propsClassName) {
            config.className = [className, propsClassName].join(' ');
        }
        if (style || propsStyle) {
            config.style = Object.assign({}, style, propsStyle);
        }
        return config;
    };
    Grid.prototype.destroy = function () {
        delete this.builder;
    };
    return Grid;
}());
export { Grid };

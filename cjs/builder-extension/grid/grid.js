"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var utility_1 = require("../../utility");
var calculator_constant_1 = require("../constant/calculator.constant");
var defaultGrid = {
    spacing: 0,
    justify: 'flex-start',
    alignItems: 'flex-start',
    groups: [12]
};
function groupByFields(fields) {
    return (0, lodash_1.groupBy)(fields, function (_a) {
        var group = _a.layout.group;
        return group;
    });
}
function groupFieldsToArray(fields) {
    return (0, lodash_1.toArray)((0, lodash_1.groupBy)(fields, function (_a) {
        var row = _a.layout.row;
        return row;
    }));
}
var Grid = /** @class */ (function () {
    function Grid(json, builder) {
        this.builder = builder;
        this.config = this.serializationConfig(json.grid);
    }
    Grid.prototype.serializationConfig = function (gridConfig) {
        var _a = (0, lodash_1.merge)((0, utility_1.cloneDeepPlain)(defaultGrid), gridConfig), _b = _a.id, id = _b === void 0 ? calculator_constant_1.LATOUT_ID : _b, groups = _a.groups, _c = _a.additional, additional = _c === void 0 ? [] : _c, other = tslib_1.__rest(_a, ["id", "groups", "additional"]);
        var justify = other.justify, alignItems = other.alignItems, spacing = other.spacing;
        var groupLayout = (0, lodash_1.groupBy)(additional, function (_a) {
            var group = _a.group;
            return group;
        });
        var defaultGroupAdditional = { justify: justify, alignItems: alignItems, spacing: spacing };
        var groupAdditional = groups.map(function (xs, index) {
            var _a = (groupLayout[index + 1] || [])[0], item = _a === void 0 ? {} : _a;
            return tslib_1.__assign(tslib_1.__assign({ xs: xs }, defaultGroupAdditional), item);
        });
        return tslib_1.__assign(tslib_1.__assign({ id: id }, other), { additional: groupAdditional });
    };
    Grid.prototype.getViewGrip = function (props) {
        var config = (0, utility_1.cloneDeepPlain)(this.config);
        var _a = config.additional, additional = _a === void 0 ? [] : _a, _b = config.className, className = _b === void 0 ? '' : _b, style = config.style;
        var _c = props.className, propsClassName = _c === void 0 ? '' : _c, propsStyle = props.style;
        var groupLayout = groupByFields(this.builder.fields);
        config.additional = additional.filter(function (item, group) {
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
    };
    Grid.prototype.destory = function () {
        delete this.builder;
    };
    return Grid;
}());
exports.Grid = Grid;

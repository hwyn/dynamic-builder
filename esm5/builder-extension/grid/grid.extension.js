import { __extends } from "tslib";
import { cloneDeep, merge } from 'lodash';
import { LAYOUT_ELEMENT } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { ELEMENT, GRID, LAYOUT, LOAD } from '../constant/calculator.constant';
import { Grid } from './grid';
var defaultLayout = { column: 12, group: 1 };
var GridExtension = /** @class */ (function (_super) {
    __extends(GridExtension, _super);
    function GridExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getLayoutElement = _this.injector.get(LAYOUT_ELEMENT);
        return _this;
    }
    GridExtension.prototype.extension = function () {
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLoadGrid.bind(this)),
            dependents: { type: LOAD, fieldId: this.builder.id }
        });
    };
    GridExtension.prototype.createLoadGrid = function () {
        this.defineProperty(this.cache, GRID, new Grid(this.builder, this.json));
        this.layoutBuildFields = this.mapFields(this.jsonFields, this.addFieldLayout.bind(this, {}));
        this.defineProperty(this.builder, ELEMENT, this.getLayoutElement(this.cache.grid, this.builder));
    };
    GridExtension.prototype.addFieldLayout = function (cursor, _a) {
        var builderField = _a[1];
        var field = builderField.field, _b = builderField.field.layout, layout = _b === void 0 ? {} : _b;
        var mergeLayout = merge(cloneDeep(defaultLayout), layout);
        var row = mergeLayout.row, group = mergeLayout.group;
        cursor[group] = row || cursor[group] || 1;
        this.defineProperty(builderField, LAYOUT, merge({ row: cursor[group] }, mergeLayout));
        delete field.layout;
    };
    GridExtension.prototype.destory = function () {
        var _this = this;
        this.defineProperty(this.cache, GRID, null);
        this.defineProperty(this.builder, ELEMENT, null);
        this.layoutBuildFields.forEach(function (builderField) { return _this.defineProperty(builderField, LAYOUT, null); });
        return _super.prototype.destory.call(this);
    };
    return GridExtension;
}(BasicExtension));
export { GridExtension };

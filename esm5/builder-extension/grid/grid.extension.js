import { __extends } from "tslib";
import { merge } from 'lodash';
import { GRID_PARSE, LAYOUT_ELEMENT } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { ELEMENT, GRID, LAYOUT, LAYOUT_FIELD, LOAD_SOURCE } from '../constant/calculator.constant';
var defaultLayout = { container: 'default', column: 12, group: 1 };
var GridExtension = /** @class */ (function (_super) {
    __extends(GridExtension, _super);
    function GridExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getGrid = _this.injector.get(GRID_PARSE);
        _this.getLayoutElement = _this.injector.get(LAYOUT_ELEMENT);
        return _this;
    }
    GridExtension.prototype.extension = function () {
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLoadGrid.bind(this)),
            dependents: { type: LOAD_SOURCE, fieldId: this.builder.id }
        });
    };
    GridExtension.prototype.createLoadGrid = function () {
        this.defineProperty(this.cache, GRID, this.getGrid(this.json, this.builder));
        this.layoutBuildFields = this.mapFields(this.jsonFields, this.addFieldLayout.bind(this, {}));
        this.defineProperty(this.builder, ELEMENT, this.getLayoutElement(this.cache.grid, this.builder));
        this.builderFields = this.mapFields(this.jsonFields.filter(function (_a) {
            var type = _a.type;
            return type === LAYOUT_FIELD;
        }), this.addLayoutElement.bind(this));
    };
    GridExtension.prototype.addLayoutElement = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        if (!builderField.element) {
            builderField.element = this.getLayoutElement(this.getGrid(jsonField, this.builder), this.builder);
            delete builderField.field.grid;
        }
    };
    GridExtension.prototype.addFieldLayout = function (cursor, _a) {
        var builderField = _a[1];
        var field = builderField.field, _b = builderField.field.layout, layout = _b === void 0 ? {} : _b;
        var mergeLayout = merge(this.cloneDeepPlain(defaultLayout), layout);
        var container = mergeLayout.container, group = mergeLayout.group, row = mergeLayout.row;
        cursor[container] = cursor[container] || {};
        cursor[container][group] = row || cursor[container][group] || 1;
        this.defineProperty(builderField, LAYOUT, merge({ row: cursor[container][group] }, mergeLayout));
        delete field.layout;
    };
    GridExtension.prototype.destroy = function () {
        var _this = this;
        this.cache.grid.destroy();
        this.defineProperty(this.cache, GRID, null);
        this.defineProperty(this.builder, ELEMENT, null);
        this.layoutBuildFields.forEach(function (builderField) { return _this.defineProperty(builderField, LAYOUT, null); });
        this.builderFields.forEach(function (builderField) { return delete builderField.element; });
        return _super.prototype.destroy.call(this);
    };
    return GridExtension;
}(BasicExtension));
export { GridExtension };

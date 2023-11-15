import { __extends } from "tslib";
import { merge } from 'lodash';
import { GRID_PARSE, LAYOUT_ELEMENT } from '../../token';
import { BasicExtension } from '../basic/basic.extension';
import { ELEMENT, GRID, GRID_ELEMENT, LAYOUT, LAYOUT_FIELD, LOAD_SOURCE } from '../constant/calculator.constant';
var defaultLayout = { column: 12, group: 1 };
var GridExtension = /** @class */ (function (_super) {
    __extends(GridExtension, _super);
    function GridExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.builderFields = [];
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
    };
    GridExtension.prototype.addLayoutElement = function (_a) {
        var _b;
        var jsonField = _a[0], builderField = _a[1];
        var grid = this.getGrid(jsonField, this.builder);
        var gridElement = this.getLayoutElement(grid, this.builder);
        if (grid.config.container === this.builder.$$cache.grid.config.container) {
            throw new Error("".concat(jsonField.id, " container is error"));
        }
        if (jsonField.type === LAYOUT_FIELD) {
            builderField.element = gridElement;
        }
        else {
            this.defineProperties(builderField, (_b = {}, _b[GRID] = grid, _b[GRID_ELEMENT] = gridElement, _b));
        }
        this.builderFields.push(builderField);
        delete builderField.field.grid;
    };
    GridExtension.prototype.addFieldLayout = function (cursor, _a) {
        var jsonField = _a[0], builderField = _a[1];
        var field = builderField.field, _b = builderField.field.layout, layout = _b === void 0 ? {} : _b;
        var mergeLayout = merge(this.cloneDeepPlain(defaultLayout), layout);
        var _c = mergeLayout.container, container = _c === void 0 ? '__m__' : _c, group = mergeLayout.group, row = mergeLayout.row;
        cursor[container] = cursor[container] || {};
        cursor[container][group] = row || cursor[container][group] || 1;
        this.defineProperty(builderField, LAYOUT, merge({ row: cursor[container][group] }, mergeLayout));
        if (jsonField.grid || jsonField.type === LAYOUT_FIELD)
            this.addLayoutElement([jsonField, builderField]);
        delete field.layout;
    };
    GridExtension.prototype.destroy = function () {
        var _this = this;
        this.cache.grid.destroy();
        this.defineProperty(this.cache, GRID, null);
        this.defineProperty(this.builder, ELEMENT, null);
        this.layoutBuildFields.forEach(function (builderField) { return _this.defineProperty(builderField, LAYOUT, null); });
        this.builderFields.forEach(function (builderField) {
            var _a;
            (_a = builderField.grid) === null || _a === void 0 ? void 0 : _a.destroy();
            _this.unDefineProperty(builderField, [GRID, GRID_ELEMENT, 'element']);
        });
        return _super.prototype.destroy.call(this);
    };
    return GridExtension;
}(BasicExtension));
export { GridExtension };

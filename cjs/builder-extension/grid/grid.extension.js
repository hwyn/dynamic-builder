"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var token_1 = require("../../token");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var defaultLayout = { container: 'default', column: 12, group: 1 };
var GridExtension = /** @class */ (function (_super) {
    tslib_1.__extends(GridExtension, _super);
    function GridExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getGrid = _this.injector.get(token_1.GRID_PARSE);
        _this.getLayoutElement = _this.injector.get(token_1.LAYOUT_ELEMENT);
        return _this;
    }
    GridExtension.prototype.extension = function () {
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLoadGrid.bind(this)),
            dependents: { type: calculator_constant_1.LOAD_SOURCE, fieldId: this.builder.id }
        });
    };
    GridExtension.prototype.createLoadGrid = function () {
        this.defineProperty(this.cache, calculator_constant_1.GRID, this.getGrid(this.json, this.builder));
        this.layoutBuildFields = this.mapFields(this.jsonFields, this.addFieldLayout.bind(this, {}));
        this.defineProperty(this.builder, calculator_constant_1.ELEMENT, this.getLayoutElement(this.cache.grid, this.builder));
        this.builderFields = this.mapFields(this.jsonFields.filter(function (_a) {
            var type = _a.type;
            return type === calculator_constant_1.LAYOUT_FIELD;
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
        var mergeLayout = (0, lodash_1.merge)(this.cloneDeepPlain(defaultLayout), layout);
        var container = mergeLayout.container, group = mergeLayout.group, row = mergeLayout.row;
        cursor[container] = cursor[container] || {};
        cursor[container][group] = row || cursor[container][group] || 1;
        this.defineProperty(builderField, calculator_constant_1.LAYOUT, (0, lodash_1.merge)({ row: cursor[container][group] }, mergeLayout));
        delete field.layout;
    };
    GridExtension.prototype.destroy = function () {
        var _this = this;
        this.cache.grid.destroy();
        this.defineProperty(this.cache, calculator_constant_1.GRID, null);
        this.defineProperty(this.builder, calculator_constant_1.ELEMENT, null);
        this.layoutBuildFields.forEach(function (builderField) { return _this.defineProperty(builderField, calculator_constant_1.LAYOUT, null); });
        this.builderFields.forEach(function (builderField) { return delete builderField.element; });
        return _super.prototype.destroy.call(this);
    };
    return GridExtension;
}(basic_extension_1.BasicExtension));
exports.GridExtension = GridExtension;

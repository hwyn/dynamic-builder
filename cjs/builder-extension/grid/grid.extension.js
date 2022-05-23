"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridExtension = void 0;
const lodash_1 = require("lodash");
const token_1 = require("../../token");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
const grid_1 = require("./grid");
const defaultLayout = { column: 12, group: 1 };
class GridExtension extends basic_extension_1.BasicExtension {
    layoutBuildFields;
    extension() {
        this.pushCalculators(this.json, {
            action: this.bindCalculatorAction(this.createLoadGrid.bind(this)),
            dependents: { type: calculator_constant_1.LOAD, fieldId: this.builder.id }
        });
    }
    createLoadGrid() {
        this.defineProperty(this.cache, calculator_constant_1.GRID, new grid_1.Grid(this.builder, this.json));
        this.layoutBuildFields = this.mapFields(this.jsonFields, this.addFieldLayout.bind(this, {}));
        this.defineProperty(this.builder, calculator_constant_1.ELEMENT, this.ls.getProvider(token_1.BIND_BUILDER_ELEMENT, this.cache.grid, this.builder));
    }
    addFieldLayout(cursor, [, builderField]) {
        const { field, field: { layout = {} } } = builderField;
        const mergeLayout = (0, lodash_1.merge)((0, lodash_1.cloneDeep)(defaultLayout), layout);
        const { row, group } = mergeLayout;
        cursor[group] = row || cursor[group] || 1;
        this.defineProperty(builderField, calculator_constant_1.LAYOUT, (0, lodash_1.merge)({ row: cursor[group] }, mergeLayout));
        delete field.layout;
    }
    destory() {
        this.defineProperty(this.cache, calculator_constant_1.GRID, null);
        this.defineProperty(this.builder, calculator_constant_1.ELEMENT, null);
        this.layoutBuildFields.forEach((builderField) => this.defineProperty(builderField, calculator_constant_1.LAYOUT, null));
        return super.destory();
    }
}
exports.GridExtension = GridExtension;

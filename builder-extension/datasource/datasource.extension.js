"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceExtension = void 0;
const lodash_1 = require("lodash");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
class DataSourceExtension extends basic_extension_1.BasicExtension {
    builderFields;
    extension() {
        this.builderFields = this.mapFields(this.jsonFields.filter(({ dataSource }) => !(0, lodash_1.isUndefined)(dataSource)), this.addFieldCalculators.bind(this));
        if (!(0, lodash_1.isEmpty)(this.builderFields)) {
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.createOnDataSourceConfig.bind(this)),
                    dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: this.builder.id }
                }]);
        }
    }
    addFieldCalculators([jsonField, builderField]) {
        const { action, dependents, metadata } = this.serializeDataSourceConfig(jsonField);
        this.pushCalculators(jsonField, [
            { action, dependents },
            {
                action: this.bindCalculatorAction(this.createSourceConfig.bind(this, metadata)),
                dependents: { fieldId: builderField.id, type: action.type }
            }
        ]);
    }
    createSourceConfig(metadata, { actionEvent, builderField, builderField: { instance } }) {
        builderField.source = this.sourceToMetadata(actionEvent, metadata);
        instance.detectChanges();
    }
    createOnDataSourceConfig() {
        this.builderFields.forEach((builderField) => {
            const { events = {}, field } = builderField;
            this.defineProperty(builderField, this.getEventType(calculator_constant_1.DATD_SOURCE), events.onDataSource);
            delete field.dataSource;
            delete events.onDataSource;
        });
    }
    serializeDataSourceConfig(jsonField) {
        const { dataSource: jsonDataSource } = jsonField;
        const defaultDependents = { type: calculator_constant_1.LOAD_VIEW_MODEL, fieldId: this.builder.id };
        const dataSource = this.serializeCalculatorConfig(jsonDataSource, calculator_constant_1.DATD_SOURCE, defaultDependents);
        const { action, source } = dataSource;
        if (!(0, lodash_1.isEmpty)(source)) {
            action.handler = () => source;
        }
        return dataSource;
    }
    sourceToMetadata(sources, metadata = {}) {
        if ((0, lodash_1.isEmpty)(metadata)) {
            return sources;
        }
        const metdataKeys = Object.keys(metadata);
        this.toArray(sources).forEach((source) => {
            metdataKeys.forEach((key) => {
                const value = source[metadata[key]];
                if (![undefined].includes(value)) {
                    source[key] = value;
                }
            });
        });
        return sources;
    }
}
exports.DataSourceExtension = DataSourceExtension;

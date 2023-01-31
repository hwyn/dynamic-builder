import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { DATD_SOURCE, LOAD } from '../constant/calculator.constant';
export class DataSourceExtension extends BasicExtension {
    extension() {
        const jsonFields = this.jsonFields.filter(({ dataSource }) => !isUndefined(dataSource));
        if (!isEmpty(jsonFields)) {
            this.builderFields = this.mapFields(jsonFields, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.createOnDataSourceConfig.bind(this)),
                    dependents: { type: LOAD, fieldId: this.builder.id }
                }]);
        }
    }
    addFieldCalculators([jsonField, { field }]) {
        const { action, dependents, metadata } = this.serializeDataSourceConfig(jsonField);
        action.after = this.bindCalculatorAction(this.createSourceConfig.bind(this, metadata));
        this.pushCalculators(jsonField, { action, dependents });
        delete field.dataSource;
    }
    createSourceConfig(metadata, { actionEvent, builderField, builderField: { instance } }) {
        builderField.source = this.sourceToMetadata(actionEvent, metadata);
        instance.detectChanges();
    }
    createOnDataSourceConfig() {
        this.builderFields.forEach(({ events = {} }) => delete events.onDataSource);
    }
    serializeDataSourceConfig(jsonField) {
        const { dataSource: jsonDataSource } = jsonField;
        const defaultDependents = { type: LOAD, fieldId: this.builder.id };
        const dataSource = this.serializeCalculatorConfig(jsonDataSource, DATD_SOURCE, defaultDependents);
        const { action, source } = dataSource;
        if (!isEmpty(source) && !action.handler) {
            action.handler = () => source;
        }
        return dataSource;
    }
    sourceToMetadata(sources, metadata = {}) {
        if (isEmpty(metadata)) {
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

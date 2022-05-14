import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { DATD_SOURCE, LOAD_ACTION, LOAD_VIEW_MODEL } from '../constant/calculator.constant';
export class DataSourceExtension extends BasicExtension {
    builderFields;
    extension() {
        this.builderFields = this.mapFields(this.jsonFields.filter(({ dataSource }) => !isUndefined(dataSource)), this.addFieldCalculators.bind(this));
        if (!isEmpty(this.builderFields)) {
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.createOnDataSourceConfig.bind(this)),
                    dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
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
            this.defineProperty(builderField, this.getEventType(DATD_SOURCE), events.onDataSource);
            delete field.dataSource;
            delete events.onDataSource;
        });
    }
    serializeDataSourceConfig(jsonField) {
        const { dataSource: jsonDataSource } = jsonField;
        const defaultDependents = { type: LOAD_VIEW_MODEL, fieldId: this.builder.id };
        const dataSource = this.serializeCalculatorConfig(jsonDataSource, DATD_SOURCE, defaultDependents);
        const { action, source } = dataSource;
        if (!isEmpty(source)) {
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

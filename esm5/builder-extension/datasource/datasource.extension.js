import { __extends } from "tslib";
import { isEmpty, isUndefined } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { DATD_SOURCE, LOAD } from '../constant/calculator.constant';
var DataSourceExtension = /** @class */ (function (_super) {
    __extends(DataSourceExtension, _super);
    function DataSourceExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataSourceExtension.prototype.extension = function () {
        var jsonFields = this.jsonFields.filter(function (_a) {
            var dataSource = _a.dataSource;
            return !isUndefined(dataSource);
        });
        if (!isEmpty(jsonFields)) {
            this.builderFields = this.mapFields(jsonFields, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.createOnDataSourceConfig.bind(this)),
                    dependents: { type: LOAD, fieldId: this.builder.id }
                }]);
        }
    };
    DataSourceExtension.prototype.addFieldCalculators = function (_a) {
        var jsonField = _a[0], field = _a[1].field;
        var _b = this.serializeDataSourceConfig(jsonField), action = _b.action, dependents = _b.dependents, metadata = _b.metadata;
        action.after = this.bindCalculatorAction(this.createSourceConfig.bind(this, metadata));
        this.pushCalculators(jsonField, { action: action, dependents: dependents });
        delete field.dataSource;
    };
    DataSourceExtension.prototype.createSourceConfig = function (metadata, _a) {
        var actionEvent = _a.actionEvent, builderField = _a.builderField, instance = _a.builderField.instance;
        builderField.source = this.sourceToMetadata(actionEvent, metadata);
        instance.detectChanges();
    };
    DataSourceExtension.prototype.createOnDataSourceConfig = function () {
        this.builderFields.forEach(function (_a) {
            var _b = _a.events, events = _b === void 0 ? {} : _b;
            return delete events.onDataSource;
        });
    };
    DataSourceExtension.prototype.serializeDataSourceConfig = function (jsonField) {
        var jsonDataSource = jsonField.dataSource;
        var defaultDependents = { type: LOAD, fieldId: this.builder.id };
        var dataSource = this.serializeCalculatorConfig(jsonDataSource, DATD_SOURCE, defaultDependents);
        var action = dataSource.action, source = dataSource.source;
        if (!isEmpty(source) && !action.handler) {
            action.handler = function () { return source; };
        }
        return dataSource;
    };
    DataSourceExtension.prototype.sourceToMetadata = function (sources, metadata) {
        if (metadata === void 0) { metadata = {}; }
        if (isEmpty(metadata)) {
            return sources;
        }
        var metdataKeys = Object.keys(metadata);
        this.toArray(sources).forEach(function (source) {
            metdataKeys.forEach(function (key) {
                var value = source[metadata[key]];
                if (![undefined].includes(value)) {
                    source[key] = value;
                }
            });
        });
        return sources;
    };
    return DataSourceExtension;
}(BasicExtension));
export { DataSourceExtension };

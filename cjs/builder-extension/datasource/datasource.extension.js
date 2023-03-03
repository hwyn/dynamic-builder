"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var DataSourceExtension = /** @class */ (function (_super) {
    tslib_1.__extends(DataSourceExtension, _super);
    function DataSourceExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataSourceExtension.prototype.extension = function () {
        var jsonFields = this.jsonFields.filter(function (_a) {
            var dataSource = _a.dataSource;
            return !(0, lodash_1.isUndefined)(dataSource);
        });
        if (!(0, lodash_1.isEmpty)(jsonFields)) {
            this.builderFields = this.mapFields(jsonFields, this.addFieldCalculators.bind(this));
            this.pushCalculators(this.json, [{
                    action: this.bindCalculatorAction(this.createOnDataSourceConfig.bind(this)),
                    dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: this.builder.id }
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
        this.builderFields.forEach(function (field) {
            field.onDataSource = field.events.onDataSource;
            delete field.events.onDataSource;
        });
    };
    DataSourceExtension.prototype.serializeDataSourceConfig = function (jsonField) {
        var jsonDataSource = jsonField.dataSource;
        var defaultDependents = { type: calculator_constant_1.LOAD_VIEW_MODEL, fieldId: this.builder.id };
        var dataSource = this.serializeCalculatorConfig(jsonDataSource, calculator_constant_1.DATD_SOURCE, defaultDependents);
        var action = dataSource.action, source = dataSource.source;
        if (!(0, lodash_1.isEmpty)(source) && !action.handler) {
            action.handler = function () { return source; };
        }
        return dataSource;
    };
    DataSourceExtension.prototype.sourceToMetadata = function (sources, metadata) {
        if (metadata === void 0) { metadata = {}; }
        if ((0, lodash_1.isEmpty)(metadata)) {
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
}(basic_extension_1.BasicExtension));
exports.DataSourceExtension = DataSourceExtension;

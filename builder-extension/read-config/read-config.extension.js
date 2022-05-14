"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadConfigExtension = void 0;
const import_rxjs_1 = require("@fm/import-rxjs");
const lodash_1 = require("lodash");
const token_1 = require("../../token");
const utility_1 = require("../../utility");
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
class ReadConfigExtension extends basic_extension_1.BasicExtension {
    extension() {
        this.definePropertys(this.builder, { id: this.props.id, getExecuteHandler: this.createGetExecuteHandler() });
        return this.getConfigJson(this.props).pipe((0, import_rxjs_1.tap)((jsonConfig) => this.props.config = jsonConfig));
    }
    extendsConfig(jsonConfig) {
        const { extends: extendsConfig } = jsonConfig;
        const extendsProps = (0, lodash_1.isString)(extendsConfig) ? { jsonName: extendsConfig } : extendsConfig;
        return !extendsProps || extendsProps.isLoaded ? (0, import_rxjs_1.of)(jsonConfig) : this.getConfigJson(extendsProps).pipe((0, import_rxjs_1.tap)((extendsConfig) => {
            extendsConfig.isLoaded = true;
            jsonConfig.extends = extendsConfig;
        }));
    }
    preloaded(jsonConfig) {
        const builderFields = jsonConfig.fields.filter(this.eligiblePreloaded.bind(this));
        if (jsonConfig.isPreloaded || !builderFields.length) {
            return (0, import_rxjs_1.of)(jsonConfig);
        }
        return (0, utility_1.toForkJoin)(builderFields.map(this.preloadedBuildField.bind(this)));
    }
    preloadedBuildField(jsonField) {
        return this.getConfigJson(jsonField).pipe((0, import_rxjs_1.tap)((jsonConfig) => {
            jsonConfig.isPreloaded = true;
            jsonField.config = (0, lodash_1.cloneDeep)(jsonConfig);
        }));
    }
    getConfigJson(props) {
        return this.getConfigObservable(props).pipe((0, utility_1.observableTap)((jsonConfig) => this.extendsConfig(jsonConfig)), (0, import_rxjs_1.tap)((jsonConfig) => this.checkFieldRepeat(jsonConfig)), (0, utility_1.observableTap)((jsonConfig) => this.preloaded(jsonConfig)));
    }
    getConfigObservable(props) {
        const { id, jsonName = ``, jsonNameAction = ``, configAction = '', config } = props;
        const isJsonName = !!jsonName || !!jsonNameAction;
        const isJsConfig = !(0, lodash_1.isEmpty)(config) || Array.isArray(config) || !!configAction;
        let configOb;
        if (!isJsonName && !isJsConfig) {
            throw new Error(`Builder configuration is incorrect: ${id}`);
        }
        if (isJsonName) {
            const getJsonName = jsonNameAction ? this.createLoadConfigAction(jsonNameAction, props) : (0, import_rxjs_1.of)(jsonName);
            configOb = getJsonName.pipe((0, utility_1.observableMap)((configName) => this.ls.getProvider(token_1.GET_JSON_CONFIG, configName)));
        }
        else {
            configOb = configAction ? this.createLoadConfigAction(configAction, props) : (0, import_rxjs_1.of)(config);
        }
        return configOb.pipe((0, import_rxjs_1.map)((_config = []) => Object.assign({ fields: [] }, Array.isArray(_config) ? { fields: _config } : _config, id ? { id } : {})));
    }
    createLoadConfigAction(actionName, props) {
        const loadAction = { ...this.serializeAction(actionName), type: calculator_constant_1.LOAD_CONFIG_ACTION, runObservable: true };
        const interceptProps = { builder: this.builder, id: props.id };
        const actions = this.createActions([loadAction], interceptProps, { ls: this.ls });
        return actions[this.getEventType(calculator_constant_1.LOAD_CONFIG_ACTION)](props);
    }
    checkFieldRepeat(jsonConfig) {
        const { id: jsonId, fields } = jsonConfig;
        const filedIds = (0, lodash_1.uniq)(fields.map(({ id }) => id) || []);
        const { instance } = this.props;
        if (filedIds.includes(jsonId)) {
            throw new Error(`The same ID as jsonID exists in the configuration file: ${jsonId}`);
        }
        if (!(0, lodash_1.isEmpty)(filedIds) && filedIds.length !== fields.length) {
            throw new Error(`The same ID exists in the configuration file: ${jsonId}`);
        }
        if (this.builder.parent && !instance) {
            console.warn(`Builder needs to set the instance property: ${this.builder.id}`);
        }
    }
    eligiblePreloaded(props) {
        const { preloaded = true, config: { isPreloaded = false } = {} } = props;
        const eligibleAttr = ['jsonName', 'configAction', 'jsonNameAction', 'config'];
        return preloaded && !isPreloaded && eligibleAttr.some((key) => !!props[key]);
    }
    createGetExecuteHandler() {
        const builder = this.builder;
        const getExecuteHandler = this.builder.getExecuteHandler;
        return (actionName) => {
            let executeHandler;
            if ((0, lodash_1.isFunction)(getExecuteHandler)) {
                executeHandler = getExecuteHandler.call(this.builder, actionName);
            }
            executeHandler = executeHandler || builder[actionName];
            return (0, lodash_1.isFunction)(executeHandler) ? executeHandler.bind(builder) : undefined;
        };
    }
    destory() {
        this.unDefineProperty(this.builder, ['getExecuteHandler']);
        return super.destory();
    }
}
exports.ReadConfigExtension = ReadConfigExtension;

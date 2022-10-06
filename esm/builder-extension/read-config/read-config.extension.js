import { cloneDeep, isEmpty, isFunction, isString, uniq } from 'lodash';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GET_JSON_CONFIG } from '../../token';
import { observableMap, observableTap, toForkJoin } from '../../utility';
import { BasicExtension } from "../basic/basic.extension";
import { LOAD_CONFIG_ACTION } from '../constant/calculator.constant';
export class ReadConfigExtension extends BasicExtension {
    extension() {
        this.definePropertys(this.builder, { id: this.props.id, getExecuteHandler: this.createGetExecuteHandler() });
        return this.getConfigJson(this.props).pipe(tap((jsonConfig) => this.props.config = jsonConfig));
    }
    extendsConfig(jsonConfig) {
        const { extends: extendsConfig } = jsonConfig;
        const extendsProps = isString(extendsConfig) ? { jsonName: extendsConfig } : extendsConfig;
        return !extendsProps || extendsProps.isLoaded ? of(jsonConfig) : this.getConfigJson(extendsProps).pipe(tap((extendsConfig) => {
            extendsConfig.isLoaded = true;
            jsonConfig.extends = extendsConfig;
        }));
    }
    preloaded(jsonConfig) {
        const { isPreloaded, fields } = jsonConfig;
        const builderFields = !isPreloaded ? fields.filter(this.eligiblePreloaded.bind(this)) : [];
        if (!builderFields.length) {
            return of(jsonConfig);
        }
        return toForkJoin(builderFields.map(this.preloadedBuildField.bind(this)));
    }
    preloadedBuildField(jsonField) {
        return this.getConfigJson(jsonField).pipe(tap((jsonConfig) => {
            jsonConfig.isPreloaded = true;
            jsonField.config = cloneDeep(jsonConfig);
        }));
    }
    getConfigJson(props) {
        return this.getConfigObservable(props).pipe(observableTap((jsonConfig) => this.extendsConfig(jsonConfig)), tap((jsonConfig) => this.checkFieldRepeat(jsonConfig)), observableTap((jsonConfig) => this.preloaded(jsonConfig)));
    }
    getConfigObservable(props) {
        const { id, jsonName = ``, jsonNameAction = ``, configAction = '', config } = props;
        const isJsonName = !!jsonName || !!jsonNameAction;
        const isJsConfig = !isEmpty(config) || Array.isArray(config) || !!configAction;
        let configOb;
        if (!isJsonName && !isJsConfig) {
            throw new Error(`Builder configuration is incorrect: ${id}`);
        }
        if (isJsonName) {
            const getJsonName = jsonNameAction ? this.createLoadConfigAction(jsonNameAction, props) : of(jsonName);
            configOb = getJsonName.pipe(observableMap((configName) => this.injector.get(GET_JSON_CONFIG, configName)));
        }
        else {
            configOb = configAction ? this.createLoadConfigAction(configAction, props) : of(config);
        }
        return configOb.pipe(map((_config = []) => Object.assign({ fields: [] }, Array.isArray(_config) ? { fields: _config } : _config, id ? { id } : {})));
    }
    createLoadConfigAction(actionName, props) {
        const loadAction = Object.assign(Object.assign({}, this.serializeAction(actionName)), { type: LOAD_CONFIG_ACTION, runObservable: true });
        const interceptProps = { builder: this.builder, id: props.id };
        const actions = this.createActions([loadAction], interceptProps, { injector: this.injector });
        return actions[this.getEventType(LOAD_CONFIG_ACTION)](props);
    }
    checkFieldRepeat(jsonConfig) {
        const { id: jsonId, fields } = jsonConfig;
        const filedIds = uniq(fields.map(({ id }) => id) || []);
        const { instance } = this.props;
        if (filedIds.includes(jsonId)) {
            throw new Error(`The same ID as jsonID exists in the configuration file: ${jsonId}`);
        }
        if (!isEmpty(filedIds) && filedIds.length !== fields.length) {
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
            if (isFunction(getExecuteHandler)) {
                executeHandler = getExecuteHandler.call(this.builder, actionName);
            }
            executeHandler = executeHandler || builder[actionName];
            return isFunction(executeHandler) ? executeHandler.bind(builder) : undefined;
        };
    }
    destory() {
        this.unDefineProperty(this.builder, ['getExecuteHandler']);
        return super.destory();
    }
}

import { MethodProxy } from '@hwy-fm/di';
import { isEmpty, isFunction, uniq } from 'lodash';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GET_JSON_CONFIG, META_TYPE } from '../../token';
import { funcToObservable, generateUUID, observableMap, observableTap, toForkJoin } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { LOAD_CONFIG_ACTION } from '../constant/calculator.constant';
export class ReadConfigExtension extends BasicExtension {
    constructor() {
        super(...arguments);
        this.getJsonConfig = this.injector.get(GET_JSON_CONFIG);
    }
    extension() {
        var _a, _b;
        this.cache.basePath = ((_a = this.props) === null || _a === void 0 ? void 0 : _a.basePath) || ((_b = this.builder.parent) === null || _b === void 0 ? void 0 : _b.$$cache.basePath) || '';
        this.defineProperties(this.builder, { id: this.props.id, getExecuteHandler: this.createGetExecuteHandler() });
        return this.getConfigJson(this.props).pipe(tap((jsonConfig) => this.props.config = jsonConfig));
    }
    getConfig(url) {
        const isAbstractPath = /^[^\\.]+/ig.test(url);
        const urlPath = isAbstractPath ? url : `${this.cache.basePath}/${url.replace(/^\.\//, '')}`.replace(/[\\/]+/ig, '/');
        return this.getJsonConfig(urlPath);
    }
    preloaded(jsonConfig) {
        const { isPreloaded, fields } = jsonConfig;
        const builderFields = !isPreloaded ? fields.filter(this.eligiblePreloaded.bind(this)) : [];
        return !builderFields.length ? of(jsonConfig) : toForkJoin(builderFields.map(this.preloadedBuildField.bind(this)));
    }
    preloadedBuildField(jsonField) {
        return this.getConfigJson(jsonField).pipe(tap((jsonConfig) => {
            jsonConfig.isPreloaded = true;
            jsonField.config = jsonConfig;
        }));
    }
    getConfigJson(props) {
        return this.getConfigObservable(props).pipe(tap((jsonConfig) => this.checkFieldRepeat(jsonConfig)), observableTap((jsonConfig) => this.preloaded(jsonConfig)));
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
            configOb = getJsonName.pipe(observableMap((configName) => this.getConfig(configName)));
        }
        else {
            configOb = (configAction ? this.createLoadConfigAction(configAction, props) : of(config)).pipe(map(this.cloneDeepPlain));
        }
        return configOb.pipe(map((_config = []) => {
            const config = Object.assign({ fields: [] }, Array.isArray(_config) ? { fields: _config } : _config, id ? { id } : {});
            config.fields.forEach((field) => !field.id && (field.id = generateUUID(8)));
            return config;
        }));
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
        if (!this.builder.id) {
            console.info(`The configured jsonID does not exist:`, jsonConfig, this.props);
        }
        if (filedIds.includes(jsonId)) {
            throw new Error(`The same ID as jsonID exists in the configuration file: ${jsonId}`);
        }
        if (!isEmpty(filedIds) && filedIds.length !== fields.length) {
            throw new Error(`The same ID exists in the configuration file: ${jsonId}`);
        }
    }
    eligiblePreloaded(props) {
        const { preloaded = true, config: { isPreloaded = false } = {} } = props;
        return preloaded && !isPreloaded && this.isBuildField(props);
    }
    createGetExecuteHandler() {
        const empty = {};
        let metaType = empty;
        const builder = this.builder;
        const mp = this.injector.get(MethodProxy);
        const getExecuteHandler = this.builder.getExecuteHandler;
        return (actionName, isSelf = true) => {
            var _a;
            let executeHandler;
            metaType = metaType !== empty ? metaType : this.injector.get(META_TYPE);
            if (metaType && (executeHandler = metaType[actionName])) {
                return funcToObservable(mp.proxyMethod(metaType, actionName));
            }
            if (isFunction(getExecuteHandler) && (executeHandler = getExecuteHandler.call(this.builder, actionName))) {
                return executeHandler;
            }
            if (isFunction(executeHandler = builder[actionName])) {
                return funcToObservable(mp.proxyMethod(builder, actionName));
            }
            if (!isSelf && (executeHandler = (_a = builder.parent) === null || _a === void 0 ? void 0 : _a.getExecuteHandler(actionName, isSelf))) {
                return executeHandler;
            }
        };
    }
    destroy() {
        this.unDefineProperty(this.builder, ['getExecuteHandler']);
        return super.destroy();
    }
}

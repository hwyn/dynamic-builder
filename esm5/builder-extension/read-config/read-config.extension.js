import { __assign, __extends } from "tslib";
import { isEmpty, isFunction, uniq } from 'lodash';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GET_JSON_CONFIG } from '../../token';
import { observableMap, observableTap, toForkJoin } from '../../utility';
import { BasicExtension } from "../basic/basic.extension";
import { LOAD_CONFIG_ACTION } from '../constant/calculator.constant';
var ReadConfigExtension = /** @class */ (function (_super) {
    __extends(ReadConfigExtension, _super);
    function ReadConfigExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getJsonConfig = _this.injector.get(GET_JSON_CONFIG);
        return _this;
    }
    ReadConfigExtension.prototype.extension = function () {
        var _this = this;
        var _a, _b;
        this.cache.basePath = ((_a = this.props) === null || _a === void 0 ? void 0 : _a.basePath) || ((_b = this.builder.parent) === null || _b === void 0 ? void 0 : _b.$$cache.basePath) || '';
        this.defineProperties(this.builder, { id: this.props.id, getExecuteHandler: this.createGetExecuteHandler() });
        return this.getConfigJson(this.props).pipe(tap(function (jsonConfig) { return _this.props.config = jsonConfig; }));
    };
    ReadConfigExtension.prototype.getConfig = function (url) {
        var isAbstractPath = /^[^\\.]+/ig.test(url);
        var urlPath = isAbstractPath ? url : "".concat(this.cache.basePath, "/").concat(url.replace(/^\.\//, '')).replace(/[\\/]+/ig, '/');
        return this.getJsonConfig(urlPath);
    };
    ReadConfigExtension.prototype.preloaded = function (jsonConfig) {
        var isPreloaded = jsonConfig.isPreloaded, fields = jsonConfig.fields;
        var builderFields = !isPreloaded ? fields.filter(this.eligiblePreloaded.bind(this)) : [];
        if (!builderFields.length) {
            return of(jsonConfig);
        }
        return toForkJoin(builderFields.map(this.preloadedBuildField.bind(this)));
    };
    ReadConfigExtension.prototype.preloadedBuildField = function (jsonField) {
        return this.getConfigJson(jsonField).pipe(tap(function (jsonConfig) {
            jsonConfig.isPreloaded = true;
            jsonField.config = jsonConfig;
        }));
    };
    ReadConfigExtension.prototype.getConfigJson = function (props) {
        var _this = this;
        return this.getConfigObservable(props).pipe(tap(function (jsonConfig) { return _this.checkFieldRepeat(jsonConfig); }), observableTap(function (jsonConfig) { return _this.preloaded(jsonConfig); }));
    };
    ReadConfigExtension.prototype.getConfigObservable = function (props) {
        var _this = this;
        var id = props.id, _a = props.jsonName, jsonName = _a === void 0 ? "" : _a, _b = props.jsonNameAction, jsonNameAction = _b === void 0 ? "" : _b, _c = props.configAction, configAction = _c === void 0 ? '' : _c, config = props.config;
        var isJsonName = !!jsonName || !!jsonNameAction;
        var isJsConfig = !isEmpty(config) || Array.isArray(config) || !!configAction;
        var configOb;
        if (!isJsonName && !isJsConfig) {
            throw new Error("Builder configuration is incorrect: ".concat(id));
        }
        if (isJsonName) {
            var getJsonName = jsonNameAction ? this.createLoadConfigAction(jsonNameAction, props) : of(jsonName);
            configOb = getJsonName.pipe(observableMap(function (configName) { return _this.getConfig(configName); }));
        }
        else {
            configOb = (configAction ? this.createLoadConfigAction(configAction, props) : of(config)).pipe(map(this.cloneDeepPlain));
        }
        return configOb.pipe(map(function (_config) {
            if (_config === void 0) { _config = []; }
            return Object.assign({ fields: [] }, Array.isArray(_config) ? { fields: _config } : _config, id ? { id: id } : {});
        }));
    };
    ReadConfigExtension.prototype.createLoadConfigAction = function (actionName, props) {
        var loadAction = __assign(__assign({}, this.serializeAction(actionName)), { type: LOAD_CONFIG_ACTION, runObservable: true });
        var interceptProps = { builder: this.builder, id: props.id };
        var actions = this.createActions([loadAction], interceptProps, { injector: this.injector });
        return actions[this.getEventType(LOAD_CONFIG_ACTION)](props);
    };
    ReadConfigExtension.prototype.checkFieldRepeat = function (jsonConfig) {
        var jsonId = jsonConfig.id, fields = jsonConfig.fields;
        var filedIds = uniq(fields.map(function (_a) {
            var id = _a.id;
            return id;
        }) || []);
        var instance = this.props.instance;
        if (filedIds.includes(jsonId)) {
            throw new Error("The same ID as jsonID exists in the configuration file: ".concat(jsonId));
        }
        if (!isEmpty(filedIds) && filedIds.length !== fields.length) {
            throw new Error("The same ID exists in the configuration file: ".concat(jsonId));
        }
        if (this.builder.parent && !instance) {
            console.warn("Builder needs to set the instance property: ".concat(this.builder.id));
        }
    };
    ReadConfigExtension.prototype.eligiblePreloaded = function (props) {
        var _a = props.preloaded, preloaded = _a === void 0 ? true : _a, _b = props.config, _c = _b === void 0 ? {} : _b, _d = _c.isPreloaded, isPreloaded = _d === void 0 ? false : _d;
        return preloaded && !isPreloaded && this.isBuildField(props);
    };
    ReadConfigExtension.prototype.createGetExecuteHandler = function () {
        var _this = this;
        var builder = this.builder;
        var getExecuteHandler = this.builder.getExecuteHandler;
        return function (actionName) {
            var executeHandler;
            if (isFunction(getExecuteHandler)) {
                executeHandler = getExecuteHandler.call(_this.builder, actionName);
            }
            executeHandler = executeHandler || builder[actionName];
            return isFunction(executeHandler) ? executeHandler.bind(builder) : undefined;
        };
    };
    ReadConfigExtension.prototype.destroy = function () {
        this.unDefineProperty(this.builder, ['getExecuteHandler']);
        return _super.prototype.destroy.call(this);
    };
    return ReadConfigExtension;
}(BasicExtension));
export { ReadConfigExtension };

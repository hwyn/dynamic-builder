"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadConfigExtension = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var token_1 = require("../../token");
var utility_1 = require("../../utility");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var ReadConfigExtension = /** @class */ (function (_super) {
    tslib_1.__extends(ReadConfigExtension, _super);
    function ReadConfigExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getJsonConfig = _this.injector.get(token_1.GET_JSON_CONFIG);
        return _this;
    }
    ReadConfigExtension.prototype.extension = function () {
        var _this = this;
        var _a, _b;
        this.cache.basePath = ((_a = this.props) === null || _a === void 0 ? void 0 : _a.basePath) || ((_b = this.builder.parent) === null || _b === void 0 ? void 0 : _b.$$cache.basePath) || '';
        this.defineProperties(this.builder, { id: this.props.id, getExecuteHandler: this.createGetExecuteHandler() });
        return this.getConfigJson(this.props).pipe((0, operators_1.tap)(function (jsonConfig) { return _this.props.config = jsonConfig; }));
    };
    ReadConfigExtension.prototype.getConfig = function (url) {
        var isAbstractPath = /^[^\\.]+/ig.test(url);
        var urlPath = isAbstractPath ? url : "".concat(this.cache.basePath, "/").concat(url.replace(/^\.\//, '')).replace(/[\\/]+/ig, '/');
        return this.getJsonConfig(urlPath);
    };
    ReadConfigExtension.prototype.preloaded = function (jsonConfig) {
        var isPreloaded = jsonConfig.isPreloaded, fields = jsonConfig.fields;
        var builderFields = !isPreloaded ? fields.filter(this.eligiblePreloaded.bind(this)) : [];
        return !builderFields.length ? (0, rxjs_1.of)(jsonConfig) : (0, utility_1.toForkJoin)(builderFields.map(this.preloadedBuildField.bind(this)));
    };
    ReadConfigExtension.prototype.preloadedBuildField = function (jsonField) {
        return this.getConfigJson(jsonField).pipe((0, operators_1.tap)(function (jsonConfig) {
            jsonConfig.isPreloaded = true;
            jsonField.config = jsonConfig;
        }));
    };
    ReadConfigExtension.prototype.getConfigJson = function (props) {
        var _this = this;
        return this.getConfigObservable(props).pipe((0, operators_1.tap)(function (jsonConfig) { return _this.checkFieldRepeat(jsonConfig); }), (0, utility_1.observableTap)(function (jsonConfig) { return _this.preloaded(jsonConfig); }));
    };
    ReadConfigExtension.prototype.getConfigObservable = function (props) {
        var _this = this;
        var id = props.id, _a = props.jsonName, jsonName = _a === void 0 ? "" : _a, _b = props.jsonNameAction, jsonNameAction = _b === void 0 ? "" : _b, _c = props.configAction, configAction = _c === void 0 ? '' : _c, config = props.config;
        var isJsonName = !!jsonName || !!jsonNameAction;
        var isJsConfig = !(0, lodash_1.isEmpty)(config) || Array.isArray(config) || !!configAction;
        var configOb;
        if (!isJsonName && !isJsConfig) {
            throw new Error("Builder configuration is incorrect: ".concat(id));
        }
        if (isJsonName) {
            var getJsonName = jsonNameAction ? this.createLoadConfigAction(jsonNameAction, props) : (0, rxjs_1.of)(jsonName);
            configOb = getJsonName.pipe((0, utility_1.observableMap)(function (configName) { return _this.getConfig(configName); }));
        }
        else {
            configOb = (configAction ? this.createLoadConfigAction(configAction, props) : (0, rxjs_1.of)(config)).pipe((0, operators_1.map)(this.cloneDeepPlain));
        }
        return configOb.pipe((0, operators_1.map)(function (_config) {
            if (_config === void 0) { _config = []; }
            return Object.assign({ fields: [] }, Array.isArray(_config) ? { fields: _config } : _config, id ? { id: id } : {});
        }));
    };
    ReadConfigExtension.prototype.createLoadConfigAction = function (actionName, props) {
        var loadAction = tslib_1.__assign(tslib_1.__assign({}, this.serializeAction(actionName)), { type: calculator_constant_1.LOAD_CONFIG_ACTION, runObservable: true });
        var interceptProps = { builder: this.builder, id: props.id };
        var actions = this.createActions([loadAction], interceptProps, { injector: this.injector });
        return actions[this.getEventType(calculator_constant_1.LOAD_CONFIG_ACTION)](props);
    };
    ReadConfigExtension.prototype.checkFieldRepeat = function (jsonConfig) {
        var jsonId = jsonConfig.id, fields = jsonConfig.fields;
        var filedIds = (0, lodash_1.uniq)(fields.map(function (_a) {
            var id = _a.id;
            return id;
        }) || []);
        var instance = this.props.instance;
        if (filedIds.includes(jsonId)) {
            throw new Error("The same ID as jsonID exists in the configuration file: ".concat(jsonId));
        }
        if (!(0, lodash_1.isEmpty)(filedIds) && filedIds.length !== fields.length) {
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
        var empty = {};
        var metaType = empty;
        var builder = this.builder;
        var mp = this.injector.get(di_1.MethodProxy);
        var getExecuteHandler = this.builder.getExecuteHandler;
        return function (actionName, isSelf) {
            var _a;
            if (isSelf === void 0) { isSelf = true; }
            var executeHandler;
            metaType = metaType !== empty ? metaType : _this.injector.get(token_1.META_TYPE);
            if (metaType && (executeHandler = metaType[actionName])) {
                return (0, utility_1.funcToObservable)(mp.proxyMethodAsync(metaType, actionName));
            }
            if (!isSelf && (executeHandler = (_a = builder.parent) === null || _a === void 0 ? void 0 : _a.getExecuteHandler(actionName, isSelf))) {
                return executeHandler;
            }
            if ((0, lodash_1.isFunction)(getExecuteHandler) && (executeHandler = getExecuteHandler.call(_this.builder, actionName))) {
                return executeHandler;
            }
            if ((0, lodash_1.isFunction)(executeHandler = builder[actionName])) {
                return (0, utility_1.funcToObservable)(mp.proxyMethodAsync(builder, actionName));
            }
        };
    };
    ReadConfigExtension.prototype.destroy = function () {
        this.unDefineProperty(this.builder, ['getExecuteHandler']);
        return _super.prototype.destroy.call(this);
    };
    return ReadConfigExtension;
}(basic_extension_1.BasicExtension));
exports.ReadConfigExtension = ReadConfigExtension;

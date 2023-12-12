"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicUtility = void 0;
var utility_1 = require("../../utility/utility");
var create_actions_1 = require("../action/create-actions");
var BasicUtility = /** @class */ (function () {
    function BasicUtility(builder, props, cache, json) {
        var _a;
        this.builder = builder;
        this.props = props;
        this.cache = cache;
        this.json = json;
        this.injector = this.builder.injector;
        this.jsonFields = (_a = this.json) === null || _a === void 0 ? void 0 : _a.fields;
    }
    Object.defineProperty(BasicUtility.prototype, "builderAttr", {
        get: function () {
            return ['jsonName', 'configAction', 'jsonNameAction', 'config'];
        },
        enumerable: false,
        configurable: true
    });
    BasicUtility.prototype.serializeAction = function (action) {
        return (0, utility_1.serializeAction)(action);
    };
    BasicUtility.prototype.getJsonFieldById = function (fieldId) {
        return this.jsonFields.find(function (_a) {
            var id = _a.id;
            return fieldId === id;
        });
    };
    BasicUtility.prototype.isBuildField = function (props) {
        return this.builderAttr.some(function (key) { return !!props[key]; });
    };
    BasicUtility.prototype.getEventType = function (type) {
        return (0, create_actions_1.getEventType)(type);
    };
    BasicUtility.prototype.getActionType = function (type) {
        return (0, create_actions_1.getActionType)(type);
    };
    BasicUtility.prototype.toArray = function (obj) {
        return Array.isArray(obj) ? obj : [obj];
    };
    BasicUtility.prototype.defineProperty = function (object, prototypeName, value) {
        Object.defineProperty(object, prototypeName, (0, utility_1.withValue)(value));
    };
    BasicUtility.prototype.unDefineProperty = function (object, prototypeNames) {
        var _this = this;
        prototypeNames.forEach(function (prototypeName) { return _this.defineProperty(object, prototypeName, null); });
    };
    return BasicUtility;
}());
exports.BasicUtility = BasicUtility;

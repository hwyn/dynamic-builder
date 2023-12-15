import { serializeAction, withValue } from '../../utility/utility';
import { getActionType, getEventType } from '../action/create-actions';
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
        return serializeAction(action);
    };
    BasicUtility.prototype.factoryBindFn = function (handler) {
        var cacheMap = [];
        this.cache.bindFn.push(function () {
            while (cacheMap.length)
                handler(cacheMap.shift());
        });
        return function (item) { return cacheMap.push(item); };
    };
    BasicUtility.prototype.removeAction = function (action) {
        var before = action.before, after = action.after;
        before && this.removeAction(before);
        after && this.removeAction(after);
        delete action.handler;
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
        return getEventType(type);
    };
    BasicUtility.prototype.getActionType = function (type) {
        return getActionType(type);
    };
    BasicUtility.prototype.toArray = function (obj) {
        return Array.isArray(obj) ? obj : [obj];
    };
    BasicUtility.prototype.defineProperty = function (object, prototypeName, value) {
        Object.defineProperty(object, prototypeName, withValue(value));
    };
    BasicUtility.prototype.unDefineProperty = function (object, prototypeNames) {
        var _this = this;
        prototypeNames.forEach(function (prototypeName) { return _this.defineProperty(object, prototypeName, null); });
    };
    return BasicUtility;
}());
export { BasicUtility };

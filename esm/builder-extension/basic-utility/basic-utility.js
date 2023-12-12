import { serializeAction, withValue } from '../../utility/utility';
import { getActionType, getEventType } from '../action/create-actions';
export class BasicUtility {
    constructor(builder, props, cache, json) {
        var _a;
        this.builder = builder;
        this.props = props;
        this.cache = cache;
        this.json = json;
        this.injector = this.builder.injector;
        this.jsonFields = (_a = this.json) === null || _a === void 0 ? void 0 : _a.fields;
    }
    get builderAttr() {
        return ['jsonName', 'configAction', 'jsonNameAction', 'config'];
    }
    serializeAction(action) {
        return serializeAction(action);
    }
    getJsonFieldById(fieldId) {
        return this.jsonFields.find(({ id }) => fieldId === id);
    }
    isBuildField(props) {
        return this.builderAttr.some((key) => !!props[key]);
    }
    getEventType(type) {
        return getEventType(type);
    }
    getActionType(type) {
        return getActionType(type);
    }
    toArray(obj) {
        return Array.isArray(obj) ? obj : [obj];
    }
    defineProperty(object, prototypeName, value) {
        Object.defineProperty(object, prototypeName, withValue(value));
    }
    unDefineProperty(object, prototypeNames) {
        prototypeNames.forEach((prototypeName) => this.defineProperty(object, prototypeName, null));
    }
}

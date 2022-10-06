import { __assign, __extends } from "tslib";
import { isEmpty } from 'lodash';
import { BasicExtension } from '../basic/basic.extension';
import { ADD_EVENT_LISTENER, EVENTS, LOAD_ACTION, LOAD_VIEW_MODEL } from '../constant/calculator.constant';
var ActionExtension = /** @class */ (function (_super) {
    __extends(ActionExtension, _super);
    function ActionExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fields = [];
        return _this;
    }
    ActionExtension.prototype.extension = function () {
        var eachCallback = this.create.bind(this);
        var handler = this.eachFields.bind(this, this.jsonFields, eachCallback);
        this.pushCalculators(this.json, {
            action: { type: LOAD_ACTION, handler: handler },
            dependents: { type: LOAD_VIEW_MODEL, fieldId: this.builder.id }
        });
    };
    ActionExtension.prototype.create = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        var _b = jsonField.actions, actions = _b === void 0 ? [] : _b;
        this.defineProperty(builderField, ADD_EVENT_LISTENER, this.addFieldEvent.bind(this, builderField));
        if (!isEmpty(actions))
            builderField.addEventListener(actions);
        this.fields.push(builderField);
        delete builderField.field.actions;
    };
    ActionExtension.prototype.addFieldEvent = function (builderField, actions) {
        var _this = this;
        var _a = builderField.events, events = _a === void 0 ? {} : _a, id = builderField.id;
        var addActions = this.toArray(actions).filter(function (_a) {
            var type = _a.type;
            return !events[_this.getEventType(type)];
        });
        if (!isEmpty(addActions)) {
            var addEvents = this.createActions(this.toArray(addActions), { builder: this.builder, id: id }, { injector: this.injector });
            this.defineProperty(builderField, EVENTS, __assign(__assign({}, events), addEvents));
            builderField.instance.detectChanges();
        }
    };
    ActionExtension.prototype.destory = function () {
        var _this = this;
        this.fields.forEach(function (field) { return _this.unDefineProperty(field, [EVENTS, ADD_EVENT_LISTENER]); });
        _super.prototype.destory.call(this);
    };
    return ActionExtension;
}(BasicExtension));
export { ActionExtension };

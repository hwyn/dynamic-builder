import { __extends } from "tslib";
import { ACTION_INTERCEPT } from '../../token';
import { BaseType } from '../context/base-type';
var BaseAction = /** @class */ (function (_super) {
    __extends(BaseAction, _super);
    function BaseAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BaseAction.prototype, "builderField", {
        get: function () {
            return this.context.builderField;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "actionIntercept", {
        get: function () {
            return this.injector.get(ACTION_INTERCEPT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "builder", {
        get: function () {
            return this.context.builder;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "instance", {
        get: function () {
            return this.builderField && this.builderField.instance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "actionProps", {
        get: function () {
            return this.context.actionProps;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "callLink", {
        get: function () {
            return this.context.actionProps.callLink || [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "actionEvent", {
        get: function () {
            return this.context.actionEvent;
        },
        enumerable: false,
        configurable: true
    });
    return BaseAction;
}(BaseType));
export { BaseAction };

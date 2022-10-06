import { ACTION_INTERCEPT } from '../../token';
var BaseAction = /** @class */ (function () {
    function BaseAction(injector, context) {
        if (context === void 0) { context = {}; }
        this.injector = injector;
        this.context = context;
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
    Object.defineProperty(BaseAction.prototype, "actionPropos", {
        get: function () {
            return this.context.actionPropos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "callLink", {
        get: function () {
            return this.context.actionPropos.callLink || [];
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
}());
export { BaseAction };

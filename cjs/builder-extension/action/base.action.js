"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAction = void 0;
var tslib_1 = require("tslib");
var token_1 = require("../../token");
var base_type_1 = require("../context/base-type");
var BaseAction = /** @class */ (function (_super) {
    tslib_1.__extends(BaseAction, _super);
    function BaseAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAction.prototype.invoke = function (context) {
        return _super.prototype.invoke.call(this, { context: context });
    };
    Object.defineProperty(BaseAction.prototype, "builderField", {
        get: function () {
            return this.context.builderField;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "actionIntercept", {
        get: function () {
            return this.injector.get(token_1.ACTION_INTERCEPT);
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
}(base_type_1.BaseType));
exports.BaseAction = BaseAction;

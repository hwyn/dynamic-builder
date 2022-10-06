"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseView = void 0;
var lodash_1 = require("lodash");
var BaseView = /** @class */ (function () {
    function BaseView(injector, store) {
        this.injector = injector;
        this.store = store;
    }
    BaseView.prototype.setBindValue = function (binding, value) {
        (0, lodash_1.set)(this.store, binding.path, value);
    };
    BaseView.prototype.getBindValue = function (binding) {
        return (0, lodash_1.get)(this.store, binding.path, binding.default);
    };
    BaseView.prototype.refreshData = function (model) {
        this.store = model;
    };
    Object.defineProperty(BaseView.prototype, "model", {
        get: function () {
            return this.store;
        },
        enumerable: false,
        configurable: true
    });
    return BaseView;
}());
exports.BaseView = BaseView;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseView = void 0;
var lodash_1 = require("lodash");
var BaseView = /** @class */ (function () {
    function BaseView(injector, _store) {
        this.injector = injector;
        this._store = _store;
    }
    BaseView.prototype.getBindValue = function (path, initialValue) {
        return (0, lodash_1.get)(this._store, path, initialValue);
    };
    BaseView.prototype.setBindValue = function (path, value) {
        (0, lodash_1.set)(this._store, path, value);
    };
    BaseView.prototype.deleteBindValue = function (path) {
        (0, lodash_1.omit)(this._store, [path]);
    };
    BaseView.prototype.refreshData = function (model) {
        this._store = model;
    };
    Object.defineProperty(BaseView.prototype, "model", {
        get: function () {
            return this._store;
        },
        enumerable: false,
        configurable: true
    });
    return BaseView;
}());
exports.BaseView = BaseView;

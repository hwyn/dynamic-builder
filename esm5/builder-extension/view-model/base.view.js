import { get, set } from 'lodash';
var BaseView = /** @class */ (function () {
    function BaseView(injector, _store) {
        this.injector = injector;
        this._store = _store;
    }
    BaseView.prototype.getBindValue = function (path, initialValue) {
        return get(this._store, path, initialValue);
    };
    BaseView.prototype.setBindValue = function (path, value) {
        set(this._store, path, value);
    };
    BaseView.prototype.deleteBindValue = function (path) {
        var store = this._store;
        var pathArr = path.split('.');
        while (pathArr.length > 1)
            store = store[pathArr.shift()];
        delete store[pathArr.pop()];
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
export { BaseView };

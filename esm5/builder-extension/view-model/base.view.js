import { get, omit, set } from 'lodash';
var BaseView = /** @class */ (function () {
    function BaseView(injector, _store) {
        this.injector = injector;
        this._store = _store;
    }
    BaseView.prototype.getBindValue = function (_a) {
        var path = _a.path, value = _a.default;
        return get(this._store, path, value);
    };
    BaseView.prototype.setBindValue = function (binding, value) {
        set(this._store, binding.path, value);
    };
    BaseView.prototype.deleteBindValue = function (binding) {
        omit(this._store, [binding.path]);
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

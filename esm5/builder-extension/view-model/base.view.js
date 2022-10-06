import { get, set } from 'lodash';
var BaseView = /** @class */ (function () {
    function BaseView(injector, store) {
        this.injector = injector;
        this.store = store;
    }
    BaseView.prototype.setBindValue = function (binding, value) {
        set(this.store, binding.path, value);
    };
    BaseView.prototype.getBindValue = function (binding) {
        return get(this.store, binding.path, binding.default);
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
export { BaseView };

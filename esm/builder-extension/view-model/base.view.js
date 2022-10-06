import { get, set } from 'lodash';
export class BaseView {
    constructor(injector, store) {
        this.injector = injector;
        this.store = store;
    }
    setBindValue(binding, value) {
        set(this.store, binding.path, value);
    }
    getBindValue(binding) {
        return get(this.store, binding.path, binding.default);
    }
    refreshData(model) {
        this.store = model;
    }
    get model() {
        return this.store;
    }
}

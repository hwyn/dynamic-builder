import { get, set } from 'lodash';
export class BaseView {
    ls;
    store;
    constructor(ls, store) {
        this.ls = ls;
        this.store = store;
    }
    setBindValue(dataBinding, value) {
        set(this.store, dataBinding.path, value);
    }
    getBindValue(dataBinding) {
        return get(this.store, dataBinding.path, dataBinding.default);
    }
    refreshData(model) {
        this.store = model;
    }
    get model() {
        return this.store;
    }
}

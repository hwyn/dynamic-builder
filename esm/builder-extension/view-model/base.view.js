import { get, omit, set } from 'lodash';
export class BaseView {
    constructor(injector, _store) {
        this.injector = injector;
        this._store = _store;
    }
    getBindValue({ path, default: value }) {
        return get(this._store, path, value);
    }
    setBindValue(binding, value) {
        set(this._store, binding.path, value);
    }
    deleteBindValue(binding) {
        omit(this._store, [binding.path]);
    }
    refreshData(model) {
        this._store = model;
    }
    get model() {
        return this._store;
    }
}

import { get, omit, set } from 'lodash';
export class BaseView {
    constructor(injector, _store) {
        this.injector = injector;
        this._store = _store;
    }
    getBindValue(path, initialValue) {
        return get(this._store, path, initialValue);
    }
    setBindValue(path, value) {
        set(this._store, path, value);
    }
    deleteBindValue(path) {
        omit(this._store, [path]);
    }
    refreshData(model) {
        this._store = model;
    }
    get model() {
        return this._store;
    }
}

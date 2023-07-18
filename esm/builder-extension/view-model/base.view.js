import { get, set } from 'lodash';
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
        let store = this._store;
        const pathArr = path.split('.');
        while (pathArr.length > 1)
            store = store[pathArr.shift()];
        delete store[pathArr.pop()];
    }
    refreshData(model) {
        this._store = model;
    }
    get model() {
        return this._store;
    }
}

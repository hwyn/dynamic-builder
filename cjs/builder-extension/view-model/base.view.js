"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseView = void 0;
const lodash_1 = require("lodash");
class BaseView {
    ls;
    store;
    constructor(ls, store) {
        this.ls = ls;
        this.store = store;
    }
    setBindValue(dataBinding, value) {
        (0, lodash_1.set)(this.store, dataBinding.path, value);
    }
    getBindValue(dataBinding) {
        return (0, lodash_1.get)(this.store, dataBinding.path, dataBinding.default);
    }
    refreshData(model) {
        this.store = model;
    }
    get model() {
        return this.store;
    }
}
exports.BaseView = BaseView;

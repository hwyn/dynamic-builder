"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseView = void 0;
const lodash_1 = require("lodash");
class BaseView {
    injector;
    store;
    constructor(injector, store) {
        this.injector = injector;
        this.store = store;
    }
    setBindValue(binding, value) {
        (0, lodash_1.set)(this.store, binding.path, value);
    }
    getBindValue(binding) {
        return (0, lodash_1.get)(this.store, binding.path, binding.default);
    }
    refreshData(model) {
        this.store = model;
    }
    get model() {
        return this.store;
    }
}
exports.BaseView = BaseView;

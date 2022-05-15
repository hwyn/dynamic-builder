"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderModel = void 0;
const lodash_1 = require("lodash");
const builder_utils_1 = require("./builder-utils");
const consts_1 = require("./consts");
class BuilderModel {
    ls;
    id;
    parent = null;
    children = [];
    $$cache = {};
    Element;
    constructor(ls) {
        this.ls = ls;
        builder_utils_1.init.call(this);
    }
    getFieldByTypes(type) {
        const { fields = [] } = this.$$cache;
        return fields.filter(({ type: fieldType }) => fieldType === type);
    }
    getAllFieldByTypes(type) {
        const fields = this.getFieldByTypes(type);
        this.children.forEach((child) => fields.push(...child.getAllFieldByTypes(type)));
        return fields;
    }
    getFieldById(id) {
        const hasSelf = id === this.id && !!this.parent;
        const { fields = [] } = this.$$cache;
        return hasSelf ? this.parent?.getFieldById(id) : fields.find(({ id: fieldId }) => fieldId === id);
    }
    getAllFieldById(id) {
        const fields = (0, lodash_1.flatMap)(this.children.map((child) => child.getAllFieldById(id)));
        fields.push(this.getFieldById(id));
        return (0, lodash_1.uniq)(fields.filter((field) => !(0, lodash_1.isEmpty)(field)));
    }
    detectChanges() {
        if (!this.$$cache.destoryed) {
            this.$$cache.detectChanges.next(undefined);
        }
    }
    get ready() {
        return this.$$cache.ready;
    }
    get root() {
        return (this.parent ? this.parent.root : this);
    }
    get fields() {
        const { fields = [] } = this.$$cache;
        return fields.filter(({ visibility }) => this.showField(visibility));
    }
    showField(visibility) {
        return visibility === undefined || visibility !== consts_1.Visibility.none;
    }
}
exports.BuilderModel = BuilderModel;

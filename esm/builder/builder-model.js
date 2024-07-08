import { __decorate, __metadata } from "tslib";
import { Inject, Injector } from '@hwy-fm/di';
import { flatMap, isEmpty, uniq } from 'lodash';
import { Visibility } from './consts';
import { DynamicModel } from './decorator';
const transform = (_meta, value, type, prop) => { var _a; return (_a = type[prop]) !== null && _a !== void 0 ? _a : value; };
let BuilderModel = class BuilderModel {
    constructor() {
        this.children = [];
        this.parent = null;
        this.$$cache = {};
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
        var _a;
        const hasSelf = id === this.id && !!this.parent;
        const { fields = [] } = this.$$cache;
        return hasSelf ? (_a = this.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(id) : fields.find(({ id: fieldId }) => fieldId === id);
    }
    getAllFieldById(id) {
        const fields = flatMap(this.children.map((child) => child.getAllFieldById(id)));
        fields.push(this.getFieldById(id));
        return uniq(fields.filter((field) => !isEmpty(field)));
    }
    showField(visibility) {
        return visibility === undefined || visibility !== Visibility.none;
    }
    detectChanges() {
        if (!this.$$cache.destroyed && this.ready) {
            this.$$cache.detectChanges(this);
        }
    }
    get listenerDetect() {
        return this.$$cache.listenerDetect;
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
};
__decorate([
    Inject(Injector, { transform }),
    __metadata("design:type", Injector)
], BuilderModel.prototype, "injector", void 0);
BuilderModel = __decorate([
    DynamicModel()
], BuilderModel);
export { BuilderModel };

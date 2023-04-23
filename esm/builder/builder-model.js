import { __decorate, __metadata } from "tslib";
import { Injector, Prop } from '@fm/di';
import { flatMap, isEmpty, uniq } from 'lodash';
import { init } from './builder-utils';
import { Visibility } from './consts';
const transform = (type, name, value) => type[name] || value;
export class BuilderModel {
    constructor() {
        this.parent = null;
        this.children = [];
        this.$$cache = {};
        init.call(this);
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
    detectChanges() {
        if (!this.$$cache.destroyed && this.ready) {
            this.listenerDetect.next(this);
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
    showField(visibility) {
        return visibility === undefined || visibility !== Visibility.none;
    }
}
__decorate([
    Prop(Injector, { transform }),
    __metadata("design:type", Injector)
], BuilderModel.prototype, "injector", void 0);

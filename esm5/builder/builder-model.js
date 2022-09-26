import { flatMap, isEmpty, uniq } from 'lodash';
import { init } from './builder-utils';
import { Visibility } from './consts';
export class BuilderModel {
    injector;
    id;
    parent = null;
    children = [];
    $$cache = {};
    Element;
    constructor(injector) {
        this.injector = injector;
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
        const hasSelf = id === this.id && !!this.parent;
        const { fields = [] } = this.$$cache;
        return hasSelf ? this.parent?.getFieldById(id) : fields.find(({ id: fieldId }) => fieldId === id);
    }
    getAllFieldById(id) {
        const fields = flatMap(this.children.map((child) => child.getAllFieldById(id)));
        fields.push(this.getFieldById(id));
        return uniq(fields.filter((field) => !isEmpty(field)));
    }
    detectChanges() {
        if (!this.$$cache.destoryed) {
            this.$$cache.detectChanges.next(this);
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
        return visibility === undefined || visibility !== Visibility.none;
    }
}

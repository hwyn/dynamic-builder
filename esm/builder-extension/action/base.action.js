import { ACTION_INTERCEPT } from '../../token';
export class BaseAction {
    ls;
    context;
    constructor(ls, context = {}) {
        this.ls = ls;
        this.context = context;
    }
    get builderField() {
        return this.context.builderField;
    }
    get actionIntercept() {
        return this.ls.getProvider(ACTION_INTERCEPT);
    }
    get builder() {
        return this.context.builder;
    }
    get instance() {
        return this.builderField && this.builderField.instance;
    }
    get actionPropos() {
        return this.context.actionPropos;
    }
    get callLink() {
        return this.context.actionPropos.callLink || [];
    }
    get actionEvent() {
        return this.context.actionEvent;
    }
}

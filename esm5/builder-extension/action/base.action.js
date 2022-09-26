import { ACTION_INTERCEPT } from '../../token';
export class BaseAction {
    injector;
    context;
    constructor(injector, context = {}) {
        this.injector = injector;
        this.context = context;
    }
    get builderField() {
        return this.context.builderField;
    }
    get actionIntercept() {
        return this.injector.get(ACTION_INTERCEPT);
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

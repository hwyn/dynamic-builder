import { ACTION_INTERCEPT } from '../../token';
import { BaseType } from '../context/base-type';
export class BaseAction extends BaseType {
    invoke(context = {}) {
        return Object.assign(this, { context });
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

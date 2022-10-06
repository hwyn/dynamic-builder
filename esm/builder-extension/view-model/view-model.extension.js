import { BasicExtension } from '../basic/basic.extension';
import { LOAD, LOAD_VIEW_MODEL, NOTIFY_VIEW_MODEL_CHANGE, REFRES_DATA, VIEW_MODEL } from '../constant/calculator.constant';
import { BaseView } from './base.view';
export class ViewModelExtension extends BasicExtension {
    extension() {
        this.pushCalculators(this.json, {
            action: this.createViewModelCalculator(),
            dependents: { type: LOAD, fieldId: this.builder.id }
        });
    }
    createViewModelCalculator() {
        const { actions = [] } = this.json;
        const hasLoadEvent = actions.some(({ type = `` }) => type === LOAD);
        const handler = ({ actionEvent }) => {
            this.createViewModel(hasLoadEvent ? actionEvent : {});
            this.createNotifyEvent();
        };
        return { type: LOAD_VIEW_MODEL, handler };
    }
    createViewModel(store) {
        this.defineProperty(this.cache, VIEW_MODEL, store instanceof BaseView ? store : new BaseView(this.injector, store));
        this.definePropertyGet(this.builder, VIEW_MODEL, () => this.cache.viewModel.model);
    }
    createNotifyEvent() {
        const notifyAction = { type: NOTIFY_VIEW_MODEL_CHANGE, handler: this.notifyHandler.bind(this) };
        const refresAction = { type: REFRES_DATA, handler: this.refresHandler.bind(this) };
        const props = { builder: this.builder, id: this.builder.id };
        const actions = this.createActions([notifyAction, refresAction], props, { injector: this.injector });
        this.definePropertys(this.builder, {
            [NOTIFY_VIEW_MODEL_CHANGE]: actions[this.getEventType(NOTIFY_VIEW_MODEL_CHANGE)],
            [REFRES_DATA]: actions[this.getEventType(REFRES_DATA)]
        });
    }
    notifyHandler({ builder, actionEvent }, options = { hasSelf: true }) {
        if (!(options === null || options === void 0 ? void 0 : options.hasSelf)) {
            builder.children.forEach((child) => child.notifyViewModelChanges(actionEvent, options));
        }
        return actionEvent;
    }
    refresHandler({ actionEvent }) {
        var _a;
        (_a = this.cache) === null || _a === void 0 ? void 0 : _a.viewModel.refreshData(actionEvent);
    }
    destory() {
        this.unDefineProperty(this.cache, [VIEW_MODEL]);
        this.unDefineProperty(this.builder, [VIEW_MODEL, NOTIFY_VIEW_MODEL_CHANGE]);
        return super.destory();
    }
}

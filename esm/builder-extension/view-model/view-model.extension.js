import { BasicExtension } from '../basic/basic.extension';
import { LOAD, LOAD_SOURCE, LOAD_VIEW_MODEL, NOTIFY_MODEL_CHANGE, REFRESH_DATA, VIEW_MODEL } from '../constant/calculator.constant';
import { BaseView } from './base.view';
export class ViewModelExtension extends BasicExtension {
    extension() {
        this.createNotifyEvent();
        this.pushCalculators(this.json, {
            action: this.createViewModelCalculator(),
            dependents: { type: LOAD_SOURCE, fieldId: this.builder.id }
        });
    }
    createViewModelCalculator() {
        const { actions = [] } = this.json;
        const hasLoadEvent = actions.some(({ type = `` }) => type === LOAD);
        const handler = ({ actionEvent }) => {
            var _a;
            this.createViewModel(hasLoadEvent ? actionEvent : ((_a = this.builder.parent) === null || _a === void 0 ? void 0 : _a.$$cache.viewModel) || {});
            return actionEvent;
        };
        return { type: LOAD_VIEW_MODEL, handler };
    }
    createViewModel(store) {
        this.defineProperty(this.cache, VIEW_MODEL, store instanceof BaseView ? store : new BaseView(this.injector, store));
        this.definePropertyGet(this.builder, VIEW_MODEL, () => this.cache.viewModel.model);
    }
    createNotifyEvent() {
        this.pushActionToMethod([
            { type: NOTIFY_MODEL_CHANGE, handler: this.notifyHandler.bind(this) },
            { type: REFRESH_DATA, handler: this.refresHandler.bind(this) }
        ]);
    }
    notifyHandler({ builder, actionEvent }, options = { hasSelf: true }) {
        if (!(options === null || options === void 0 ? void 0 : options.hasSelf)) {
            builder.children.forEach((child) => child.notifyModelChanges(actionEvent, options));
        }
        return actionEvent;
    }
    refresHandler({ actionEvent }) {
        var _a;
        (_a = this.cache) === null || _a === void 0 ? void 0 : _a.viewModel.refreshData(actionEvent);
    }
    destory() {
        this.unDefineProperty(this.cache, [VIEW_MODEL]);
        this.unDefineProperty(this.builder, [VIEW_MODEL, REFRESH_DATA, NOTIFY_MODEL_CHANGE]);
        return super.destory();
    }
}

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
        const hasLoadAction = actions.some(({ type = `` }) => type === LOAD);
        const handler = ({ actionEvent }) => {
            var _a;
            const { viewModel } = this.props;
            this.createViewModel(hasLoadAction ? actionEvent : viewModel || ((_a = this.builder.parent) === null || _a === void 0 ? void 0 : _a.$$cache.viewModel) || {});
            return actionEvent;
        };
        return this.bindCalculatorAction(handler, LOAD_VIEW_MODEL);
    }
    createViewModel(store) {
        const baseView = store instanceof BaseView ? store : new BaseView(this.injector, store);
        this.defineProperty(this.cache, VIEW_MODEL, baseView);
        this.definePropertyGet(this.builder, VIEW_MODEL, () => baseView.model);
    }
    createNotifyEvent() {
        this.pushActionToMethod([
            { type: NOTIFY_MODEL_CHANGE, handler: this.notifyHandler },
            { type: REFRESH_DATA, handler: this.refreshHandler }
        ]);
    }
    notifyHandler({ builder, actionEvent }, options = { hasSelf: true }) {
        if (!(options === null || options === void 0 ? void 0 : options.hasSelf)) {
            builder.children.forEach((child) => child.notifyModelChanges(actionEvent, options));
        }
        return actionEvent;
    }
    refreshHandler({ actionEvent, builder }) {
        var _a, _b;
        if (actionEvent !== ((_a = builder.$$cache) === null || _a === void 0 ? void 0 : _a.viewModel)) {
            (_b = builder.$$cache) === null || _b === void 0 ? void 0 : _b.viewModel.refreshData(actionEvent);
        }
    }
    destroy() {
        this.unDefineProperty(this.cache, [VIEW_MODEL]);
        this.unDefineProperty(this.builder, [VIEW_MODEL, REFRESH_DATA, NOTIFY_MODEL_CHANGE]);
        return super.destroy();
    }
}

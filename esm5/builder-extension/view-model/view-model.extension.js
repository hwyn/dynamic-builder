import { __extends } from "tslib";
import { BasicExtension } from '../basic/basic.extension';
import { LOAD, LOAD_SOURCE, LOAD_VIEW_MODEL, NOTIFY_MODEL_CHANGE, REFRESH_DATA, VIEW_MODEL } from '../constant/calculator.constant';
import { BaseView } from './base.view';
var ViewModelExtension = /** @class */ (function (_super) {
    __extends(ViewModelExtension, _super);
    function ViewModelExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewModelExtension.prototype.extension = function () {
        this.createNotifyEvent();
        this.pushCalculators(this.json, {
            action: this.createViewModelCalculator(),
            dependents: { type: LOAD_SOURCE, fieldId: this.builder.id }
        });
    };
    ViewModelExtension.prototype.createViewModelCalculator = function () {
        var _this = this;
        var _a = this.json.actions, actions = _a === void 0 ? [] : _a;
        var hasLoadAction = actions.some(function (_a) {
            var _b = _a.type, type = _b === void 0 ? "" : _b;
            return type === LOAD;
        });
        var handler = function (_a) {
            var _b;
            var actionEvent = _a.actionEvent;
            _this.createViewModel(hasLoadAction ? actionEvent : ((_b = _this.builder.parent) === null || _b === void 0 ? void 0 : _b.$$cache.viewModel) || {});
            return actionEvent;
        };
        return this.bindCalculatorAction(handler, LOAD_VIEW_MODEL);
    };
    ViewModelExtension.prototype.createViewModel = function (store) {
        var baseView = store instanceof BaseView ? store : new BaseView(this.injector, store);
        this.defineProperty(this.cache, VIEW_MODEL, baseView);
        this.definePropertyGet(this.builder, VIEW_MODEL, function () { return baseView.model; });
    };
    ViewModelExtension.prototype.createNotifyEvent = function () {
        this.pushActionToMethod([
            { type: NOTIFY_MODEL_CHANGE, handler: this.notifyHandler },
            { type: REFRESH_DATA, handler: this.refreshHandler }
        ]);
    };
    ViewModelExtension.prototype.notifyHandler = function (_a, options) {
        var builder = _a.builder, actionEvent = _a.actionEvent;
        if (options === void 0) { options = { hasSelf: true }; }
        if (!(options === null || options === void 0 ? void 0 : options.hasSelf)) {
            builder.children.forEach(function (child) { return child.notifyModelChanges(actionEvent, options); });
        }
        return actionEvent;
    };
    ViewModelExtension.prototype.refreshHandler = function (_a) {
        var _b;
        var actionEvent = _a.actionEvent, builder = _a.builder;
        (_b = builder.$$cache) === null || _b === void 0 ? void 0 : _b.viewModel.refreshData(actionEvent);
    };
    ViewModelExtension.prototype.destroy = function () {
        this.unDefineProperty(this.cache, [VIEW_MODEL]);
        this.unDefineProperty(this.builder, [VIEW_MODEL, REFRESH_DATA, NOTIFY_MODEL_CHANGE]);
        return _super.prototype.destroy.call(this);
    };
    return ViewModelExtension;
}(BasicExtension));
export { ViewModelExtension };

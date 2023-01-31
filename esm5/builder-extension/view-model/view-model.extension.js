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
        this.pushCalculators(this.json, {
            action: this.createViewModelCalculator(),
            dependents: { type: LOAD_SOURCE, fieldId: this.builder.id }
        });
    };
    ViewModelExtension.prototype.createViewModelCalculator = function () {
        var _this = this;
        var _a = this.json.actions, actions = _a === void 0 ? [] : _a;
        var hasLoadEvent = actions.some(function (_a) {
            var _b = _a.type, type = _b === void 0 ? "" : _b;
            return type === LOAD;
        });
        var handler = function (_a) {
            var actionEvent = _a.actionEvent;
            _this.createViewModel(hasLoadEvent ? actionEvent : {});
            _this.createNotifyEvent();
        };
        return { type: LOAD_VIEW_MODEL, handler: handler };
    };
    ViewModelExtension.prototype.createViewModel = function (store) {
        var _this = this;
        this.defineProperty(this.cache, VIEW_MODEL, store instanceof BaseView ? store : new BaseView(this.injector, store));
        this.definePropertyGet(this.builder, VIEW_MODEL, function () { return _this.cache.viewModel.model; });
    };
    ViewModelExtension.prototype.createNotifyEvent = function () {
        this.pushActionToMethod([
            { type: NOTIFY_MODEL_CHANGE, handler: this.notifyHandler.bind(this) },
            { type: REFRESH_DATA, handler: this.refresHandler.bind(this) }
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
    ViewModelExtension.prototype.refresHandler = function (_a) {
        var _b;
        var actionEvent = _a.actionEvent;
        (_b = this.cache) === null || _b === void 0 ? void 0 : _b.viewModel.refreshData(actionEvent);
    };
    ViewModelExtension.prototype.destory = function () {
        this.unDefineProperty(this.cache, [VIEW_MODEL]);
        this.unDefineProperty(this.builder, [VIEW_MODEL, REFRESH_DATA, NOTIFY_MODEL_CHANGE]);
        return _super.prototype.destory.call(this);
    };
    return ViewModelExtension;
}(BasicExtension));
export { ViewModelExtension };

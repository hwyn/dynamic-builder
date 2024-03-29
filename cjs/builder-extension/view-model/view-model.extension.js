"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewModelExtension = void 0;
var tslib_1 = require("tslib");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var base_view_1 = require("./base.view");
var ViewModelExtension = /** @class */ (function (_super) {
    tslib_1.__extends(ViewModelExtension, _super);
    function ViewModelExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewModelExtension.prototype.extension = function () {
        this.createNotifyEvent();
        this.pushCalculators(this.json, {
            action: this.createViewModelCalculator(),
            dependents: { type: calculator_constant_1.LOAD_SOURCE, fieldId: this.builder.id }
        });
    };
    ViewModelExtension.prototype.createViewModelCalculator = function () {
        var _this = this;
        var _a = this.json.actions, actions = _a === void 0 ? [] : _a;
        var hasLoadAction = actions.some(function (_a) {
            var _b = _a.type, type = _b === void 0 ? "" : _b;
            return type === calculator_constant_1.LOAD;
        });
        var handler = function (_a) {
            var _b;
            var actionEvent = _a.actionEvent;
            var viewModel = _this.props.viewModel;
            _this.createViewModel(hasLoadAction ? actionEvent : viewModel || ((_b = _this.builder.parent) === null || _b === void 0 ? void 0 : _b.$$cache.viewModel) || {});
            return actionEvent;
        };
        return this.bindCalculatorAction(handler, calculator_constant_1.LOAD_VIEW_MODEL);
    };
    ViewModelExtension.prototype.createViewModel = function (store) {
        var baseView = store instanceof base_view_1.BaseView ? store : new base_view_1.BaseView(this.injector, store);
        this.defineProperty(this.cache, calculator_constant_1.VIEW_MODEL, baseView);
        this.definePropertyGet(this.builder, calculator_constant_1.VIEW_MODEL, function () { return baseView.model; });
    };
    ViewModelExtension.prototype.createNotifyEvent = function () {
        this.pushActionToMethod([
            { type: calculator_constant_1.NOTIFY_MODEL_CHANGE, handler: this.notifyHandler },
            { type: calculator_constant_1.REFRESH_DATA, handler: this.refreshHandler }
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
        var _b, _c;
        var actionEvent = _a.actionEvent, builder = _a.builder;
        if (actionEvent !== ((_b = builder.$$cache) === null || _b === void 0 ? void 0 : _b.viewModel)) {
            (_c = builder.$$cache) === null || _c === void 0 ? void 0 : _c.viewModel.refreshData(actionEvent);
        }
    };
    ViewModelExtension.prototype.destroy = function () {
        this.unDefineProperty(this.cache, [calculator_constant_1.VIEW_MODEL]);
        this.unDefineProperty(this.builder, [calculator_constant_1.VIEW_MODEL, calculator_constant_1.REFRESH_DATA, calculator_constant_1.NOTIFY_MODEL_CHANGE]);
        return _super.prototype.destroy.call(this);
    };
    return ViewModelExtension;
}(basic_extension_1.BasicExtension));
exports.ViewModelExtension = ViewModelExtension;

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
        this.pushCalculators(this.json, {
            action: this.createViewModelCalculator(),
            dependents: { type: calculator_constant_1.LOAD_SOURCE, fieldId: this.builder.id }
        });
    };
    ViewModelExtension.prototype.createViewModelCalculator = function () {
        var _this = this;
        var _a = this.json.actions, actions = _a === void 0 ? [] : _a;
        var hasLoadEvent = actions.some(function (_a) {
            var _b = _a.type, type = _b === void 0 ? "" : _b;
            return type === calculator_constant_1.LOAD;
        });
        var handler = function (_a) {
            var actionEvent = _a.actionEvent;
            _this.createViewModel(hasLoadEvent ? actionEvent : {});
            _this.createNotifyEvent();
        };
        return { type: calculator_constant_1.LOAD_VIEW_MODEL, handler: handler };
    };
    ViewModelExtension.prototype.createViewModel = function (store) {
        var _this = this;
        this.defineProperty(this.cache, calculator_constant_1.VIEW_MODEL, store instanceof base_view_1.BaseView ? store : new base_view_1.BaseView(this.injector, store));
        this.definePropertyGet(this.builder, calculator_constant_1.VIEW_MODEL, function () { return _this.cache.viewModel.model; });
    };
    ViewModelExtension.prototype.createNotifyEvent = function () {
        this.pushActionToMethod([
            { type: calculator_constant_1.NOTIFY_MODEL_CHANGE, handler: this.notifyHandler.bind(this) },
            { type: calculator_constant_1.REFRESH_DATA, handler: this.refresHandler.bind(this) }
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
        this.unDefineProperty(this.cache, [calculator_constant_1.VIEW_MODEL]);
        this.unDefineProperty(this.builder, [calculator_constant_1.VIEW_MODEL, calculator_constant_1.REFRESH_DATA, calculator_constant_1.NOTIFY_MODEL_CHANGE]);
        return _super.prototype.destory.call(this);
    };
    return ViewModelExtension;
}(basic_extension_1.BasicExtension));
exports.ViewModelExtension = ViewModelExtension;

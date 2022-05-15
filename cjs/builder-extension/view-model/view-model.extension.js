"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewModelExtension = void 0;
const basic_extension_1 = require("../basic/basic.extension");
const calculator_constant_1 = require("../constant/calculator.constant");
const base_view_1 = require("./base.view");
class ViewModelExtension extends basic_extension_1.BasicExtension {
    extension() {
        this.pushCalculators(this.json, {
            action: this.createViewModelCalculator(),
            dependents: { type: calculator_constant_1.LOAD, fieldId: this.builder.id }
        });
    }
    createViewModelCalculator() {
        const { actions = [] } = this.json;
        const hasLoadEvent = actions.some(({ type = `` }) => type === calculator_constant_1.LOAD);
        const handler = ({ actionEvent }) => {
            this.createViewModel(hasLoadEvent ? actionEvent : {});
            this.createNotifyEvent();
        };
        return { type: calculator_constant_1.LOAD_VIEW_MODEL, handler };
    }
    createViewModel(store) {
        this.cache.viewModel = store instanceof base_view_1.BaseView ? store : new base_view_1.BaseView(this.ls, store);
        this.definePropertyGet(this.builder, calculator_constant_1.VIEW_MODEL, () => this.cache.viewModel.model);
    }
    createNotifyEvent() {
        const notifyAction = { type: calculator_constant_1.NOTIFY_VIEW_MODEL_CHANGE, handler: this.notifyHandler.bind(this) };
        const refresAction = { type: calculator_constant_1.REFRES_DATA, handler: this.refresHandler.bind(this) };
        const props = { builder: this.builder, id: this.builder.id };
        const actions = this.createActions([notifyAction, refresAction], props, { ls: this.ls });
        this.definePropertys(this.builder, {
            [calculator_constant_1.NOTIFY_VIEW_MODEL_CHANGE]: actions[this.getEventType(calculator_constant_1.NOTIFY_VIEW_MODEL_CHANGE)],
            [calculator_constant_1.REFRES_DATA]: actions[this.getEventType(calculator_constant_1.REFRES_DATA)]
        });
    }
    notifyHandler({ builder, actionEvent }, options = { hasSelf: true }) {
        if (!options?.hasSelf) {
            builder.children.forEach((child) => child.notifyViewModelChanges(actionEvent, options));
        }
        return actionEvent;
    }
    refresHandler({ actionEvent }) {
        this.cache?.viewModel.refreshData(actionEvent);
    }
    destory() {
        this.unDefineProperty(this.builder, [calculator_constant_1.VIEW_MODEL, calculator_constant_1.NOTIFY_VIEW_MODEL_CHANGE]);
        return super.destory();
    }
}
exports.ViewModelExtension = ViewModelExtension;

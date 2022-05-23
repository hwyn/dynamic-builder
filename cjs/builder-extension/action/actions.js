"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const tslib_1 = require("tslib");
/* eslint-disable max-lines-per-function */
const di_1 = require("@fm/di");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const token_1 = require("../../token");
const utility_1 = require("../../utility");
const basic_extension_1 = require("../basic/basic.extension");
const base_action_1 = require("./base.action");
let Action = class Action {
    ls;
    actions;
    constructor(ls, actions) {
        this.ls = ls;
        this.actions = (0, lodash_1.flatMap)(actions);
    }
    getAction(name) {
        const [{ action = null } = {}] = this.actions.filter(({ name: actionName }) => actionName === name);
        return action;
    }
    createEvent(event, otherEventParam = []) {
        return [event, ...otherEventParam];
    }
    getActionContext({ builder, id } = {}) {
        return (0, lodash_1.isEmpty)(builder) ? {} : { builder, builderField: builder.getFieldById(id) };
    }
    call(calculators, builder, callLink = []) {
        return (value) => (0, rxjs_1.forkJoin)(calculators.map(({ targetId: id, action }) => {
            return this.invoke({ ...action, callLink }, { builder, id }, value);
        }));
    }
    invokeCallCalculators(calculators, { type, callLink }, props) {
        const { builder, id } = props;
        const link = [...callLink || [], { fieldId: id, type: type }];
        const filterCalculators = calculators.filter(({ dependent: { fieldId, type: cType } }) => fieldId === id && cType === type);
        return !(0, lodash_1.isEmpty)(filterCalculators) ? this.call(filterCalculators, builder, link) : (value) => (0, rxjs_1.of)(value);
    }
    invokeCalculators(actionProps, actionSub, props) {
        const { builder, id } = props;
        const { calculators } = builder;
        const nonSelfBuilders = builder.$$cache.nonSelfBuilders || [];
        const calculatorsInvokes = nonSelfBuilders.map((nonBuild) => this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id }));
        calculatorsInvokes.push(this.invokeCallCalculators(calculators || [], actionProps, props));
        return actionSub.pipe((0, utility_1.observableTap)((value) => (0, rxjs_1.forkJoin)(calculatorsInvokes.map((invokeCalculators) => invokeCalculators(value)))));
    }
    invokeAction(action, props, event = null, ...otherEventParam) {
        const { name, handler, stop } = action;
        if (stop && !(0, lodash_1.isEmpty)(event) && event?.stopPropagation) {
            event.stopPropagation();
        }
        const { after, before } = action;
        const e = this.createEvent(event, otherEventParam);
        const executeAction = () => name || handler ? this.executeAction(action, this.getActionContext(props), e) : (0, rxjs_1.of)(event);
        let actionSub = before ? this.invoke(before, props, event, otherEventParam).pipe(() => executeAction()) : executeAction();
        if (after) {
            actionSub = actionSub.pipe((0, utility_1.observableTap)((value) => this.invoke(after, props, value, ...otherEventParam)));
        }
        return actionSub;
    }
    invoke(actions, props, event = null, ...otherEventParam) {
        let actionsSub;
        let action;
        if (Array.isArray(actions)) {
            action = (0, basic_extension_1.serializeAction)(actions.filter((a) => !!(0, basic_extension_1.serializeAction)(a).type)[0]);
            actionsSub = (0, rxjs_1.forkJoin)((actions).map((a) => (this.invokeAction((0, basic_extension_1.serializeAction)(a), props, event, ...otherEventParam)))).pipe((0, operators_1.map)((result) => result.pop()));
        }
        else {
            action = (0, basic_extension_1.serializeAction)(actions);
            actionsSub = this.invokeAction(action, props, event, ...otherEventParam);
        }
        const hasInvokeCalculators = !(0, lodash_1.isEmpty)(props) && action && action.type;
        return hasInvokeCalculators ? this.invokeCalculators(action, actionsSub, props) : actionsSub;
    }
    // eslint-disable-next-line complexity
    executeAction(actionPropos, actionContext, event = this.createEvent(void (0))) {
        const [actionEvent, ...otherEvent] = event;
        const { name = ``, handler } = (0, basic_extension_1.serializeAction)(actionPropos);
        const [actionName, execute = 'execute'] = name.match(/([^.]+)/ig) || [name];
        const context = { ...actionContext, actionPropos, actionEvent };
        let action = new base_action_1.BaseAction(this.ls, context);
        let executeHandler = handler;
        let builder = action.builder;
        if (!executeHandler && builder) {
            while (builder) {
                executeHandler = builder.getExecuteHandler(name) || executeHandler;
                if (builder === builder.root) {
                    break;
                }
                builder = builder.parent;
            }
        }
        if (!executeHandler) {
            const ActionType = this.getAction(actionName);
            action = ActionType && new ActionType(this.ls, context);
            executeHandler = action && action[execute].bind(action);
        }
        if (!executeHandler) {
            throw new Error(`${name} not defined!`);
        }
        return (0, utility_1.transformObservable)(executeHandler.apply(undefined, [action, ...otherEvent]));
    }
};
Action = tslib_1.__decorate([
    tslib_1.__param(0, (0, di_1.Inject)(di_1.LocatorStorage)),
    tslib_1.__param(1, (0, di_1.Inject)(token_1.ACTIONS_CONFIG)),
    tslib_1.__metadata("design:paramtypes", [di_1.LocatorStorage, Array])
], Action);
exports.Action = Action;

import { __decorate, __metadata, __param, __rest } from "tslib";
/* eslint-disable max-lines-per-function */
import { Inject, Injector } from '@fm/di';
import { flatMap, isEmpty } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG } from '../../token';
import { observableMap, observableTap, transformObservable } from '../../utility';
import { serializeAction } from '../basic/basic.extension';
import { BaseAction } from './base.action';
let Action = class Action {
    constructor(injector, actions) {
        this.injector = injector;
        this.actions = flatMap(actions);
    }
    getAction(name) {
        const [{ action = null } = {}] = this.actions.filter(({ name: actionName }) => actionName === name);
        return action;
    }
    createEvent(event, otherEventParam = []) {
        return [event, ...otherEventParam];
    }
    getActionContext({ builder, id } = {}) {
        return isEmpty(builder) ? {} : { builder, builderField: builder.getFieldById(id) };
    }
    call(calculators, builder, callLink = []) {
        return (value) => forkJoin(calculators.map(({ targetId: id, action }) => {
            return this.invoke(Object.assign(Object.assign({}, action), { callLink }), { builder, id }, value);
        }));
    }
    invokeCallCalculators(calculators, { type, callLink }, props) {
        const { builder, id } = props;
        const link = [...callLink || [], { fieldId: id, type: type }];
        const filterCalculators = calculators.filter(({ dependent: { fieldId, type: cType } }) => fieldId === id && cType === type);
        return !isEmpty(filterCalculators) ? this.call(filterCalculators, builder, link) : (value) => of(value);
    }
    invokeCalculators(actionProps, actionSub, props) {
        const { builder, id } = props;
        const { calculators } = builder;
        const nonSelfBuilders = builder.$$cache.nonSelfBuilders || [];
        const calculatorsInvokes = nonSelfBuilders.map((nonBuild) => this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id }));
        calculatorsInvokes.push(this.invokeCallCalculators(calculators || [], actionProps, props));
        return actionSub.pipe(observableTap((value) => forkJoin(calculatorsInvokes.map((invokeCalculators) => invokeCalculators(value)))));
    }
    execute(action, props, event = null, ...otherEventParam) {
        const { name, handler, stop, type } = action;
        if (stop && !isEmpty(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        const e = this.createEvent(event, otherEventParam);
        const actionSub = name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
        const hasInvokeCalculators = !!props && action && type;
        return hasInvokeCalculators ? this.invokeCalculators(action, actionSub, props) : actionSub;
    }
    invokeAction(action, props, event = null, ...otherEventParam) {
        const { before, after } = action, current = __rest(action, ["before", "after"]);
        const execute = () => this.execute(current, props, event, ...otherEventParam);
        let actionSub = before ? this.invoke(before, props, event, ...otherEventParam).pipe(observableMap(() => execute())) : execute();
        if (after) {
            actionSub = actionSub.pipe(observableTap((value) => this.invoke(after, props, typeof value === 'undefined' ? event : value, ...otherEventParam)));
        }
        return actionSub;
    }
    invoke(actions, props, event = null, ...otherEventParam) {
        let actionsSub;
        if (Array.isArray(actions)) {
            actionsSub = forkJoin((actions).map((a) => this.invokeAction(serializeAction(a), props, event, ...otherEventParam))).pipe(map((result) => result.pop()));
        }
        else {
            actionsSub = this.invokeAction(serializeAction(actions), props, event, ...otherEventParam);
        }
        return actionsSub;
    }
    callAction(actionName, context, ...events) {
        return this.invoke(serializeAction(actionName), context, ...events);
    }
    // eslint-disable-next-line complexity
    executeAction(actionPropos, actionContext, event = this.createEvent(void (0))) {
        const [actionEvent, ...otherEvent] = event;
        const { name = ``, handler } = serializeAction(actionPropos);
        const [actionName, execute = 'execute'] = name.match(/([^.]+)/ig) || [name];
        const context = Object.assign(Object.assign({}, actionContext), { actionPropos, actionEvent });
        let action = new BaseAction(this.injector, context);
        let executeHandler = handler;
        let builder = action.builder;
        let ActionType = null;
        if (!executeHandler && (ActionType = this.getAction(actionName))) {
            action = ActionType && new ActionType(this.injector, context);
            executeHandler = action && action[execute].bind(action);
        }
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
            throw new Error(`${name} not defined!`);
        }
        return transformObservable(executeHandler.apply(undefined, [action, ...otherEvent]));
    }
};
Action = __decorate([
    __param(0, Inject(Injector)),
    __param(1, Inject(ACTIONS_CONFIG)),
    __metadata("design:paramtypes", [Injector, Array])
], Action);
export { Action };

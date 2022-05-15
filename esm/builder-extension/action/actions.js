import { __decorate, __metadata, __param } from "tslib";
/* eslint-disable max-lines-per-function */
import { Inject, LocatorStorage } from '@fm/di';
import { forkJoin, map, of } from '@fm/import-rxjs';
import { flatMap, isEmpty } from 'lodash';
import { ACTIONS_CONFIG } from '../../token';
import { observableTap, transformObservable } from '../../utility';
import { serializeAction } from '../basic/basic.extension';
import { BaseAction } from './base.action';
let Action = class Action {
    ls;
    actions;
    constructor(ls, actions) {
        this.ls = ls;
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
            return this.invoke({ ...action, callLink }, { builder, id }, value);
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
    invokeAction(action, props, event = null, ...otherEventParam) {
        const { name, handler, stop } = action;
        if (stop && !isEmpty(event) && event?.stopPropagation) {
            event.stopPropagation();
        }
        const e = this.createEvent(event, otherEventParam);
        return name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
    }
    invoke(actions, props, event = null, ...otherEventParam) {
        let actionsSub;
        let action;
        if (Array.isArray(actions)) {
            action = serializeAction(actions.filter(({ type }) => !!type)[0]);
            actionsSub = forkJoin((actions).map((a) => (this.invokeAction(serializeAction(a), props, event, ...otherEventParam)))).pipe(map((result) => result.pop()));
        }
        else {
            action = serializeAction(actions);
            actionsSub = this.invokeAction(action, props, event, ...otherEventParam);
        }
        const hasInvokeCalculators = !isEmpty(props) && action && action.type;
        return hasInvokeCalculators ? this.invokeCalculators(action, actionsSub, props) : actionsSub;
    }
    // eslint-disable-next-line complexity
    executeAction(actionPropos, actionContext, event = this.createEvent(void (0))) {
        const [actionEvent, ...otherEvent] = event;
        const { name = ``, handler } = serializeAction(actionPropos);
        const [actionName, execute = 'execute'] = name.match(/([^.]+)/ig) || [name];
        const context = { ...actionContext, actionPropos, actionEvent };
        let action = new BaseAction(this.ls, context);
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
        return transformObservable(executeHandler.apply(undefined, [action, ...otherEvent]));
    }
};
Action = __decorate([
    __param(0, Inject(LocatorStorage)),
    __param(1, Inject(ACTIONS_CONFIG)),
    __metadata("design:paramtypes", [LocatorStorage, Array])
], Action);
export { Action };

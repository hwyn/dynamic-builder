import { __decorate, __metadata, __param, __rest } from "tslib";
/* eslint-disable max-lines-per-function */
import { Inject, Injector } from '@fm/di';
import { flatMap, groupBy, isEmpty, toArray } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG } from '../../token';
<<<<<<< HEAD
import { observableMap, observableTap, toForkJoin, transformObservable } from '../../utility';
=======
import { observableMap, observableTap, transformObservable } from '../../utility';
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
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
    getCacheAction(ActionType, context, baseAction) {
        var _a;
        const { builder, actionPropos: { _uid }, builderField } = baseAction;
        const { cacheAction = [] } = builderField || {};
        let cacheType = (_a = cacheAction.find(({ uid }) => _uid === uid)) === null || _a === void 0 ? void 0 : _a.action;
        if (!cacheType) {
            cacheType = new ActionType((builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector, context);
            if (!ActionType.cache || !builderField || !_uid)
                return cacheType;
        }
        cacheType.context = context;
        builderField.cacheAction && cacheAction.push({ uid: _uid, action: cacheType });
        return cacheType;
    }
    createEvent(event, otherEventParam = []) {
        return [event, ...otherEventParam];
    }
    getActionContext({ builder, id } = {}) {
        return isEmpty(builder) ? {} : { builder, builderField: builder.getFieldById(id) };
    }
    call(calculators, builder, callLink = []) {
        const groupList = toArray(groupBy(calculators, 'targetId'));
        return (value, ...other) => forkJoin(groupList.map((links) => {
            return this.invoke(links.map(({ action }) => (Object.assign(Object.assign({}, action), { callLink }))), { builder, id: links[0].targetId }, value, ...other);
        }));
    }
    invokeCallCalculators(calculators, { type, callLink }, props) {
        const { builder, id } = props;
        const filterCalculators = calculators.filter(({ dependent: { fieldId, type: cType } }) => fieldId === id && cType === type);
        const link = [...(callLink || []), { fieldId: id, type: type, count: filterCalculators.length }];
        return !isEmpty(filterCalculators) ? this.call(filterCalculators, builder, link) : (value) => of(value);
    }
    invokeCalculators(actionProps, props, value, ...otherEventParam) {
        const { builder, id } = props;
        const nonSelfBuilders = builder.$$cache.nonSelfBuilders || [];
        const calculatorsInvokes = nonSelfBuilders.map((nonBuild) => this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id }));
        calculatorsInvokes.push(this.invokeCallCalculators(builder.calculators || [], actionProps, props));
        return forkJoin(calculatorsInvokes.map((invokeCalculators) => invokeCalculators(value, ...otherEventParam)));
    }
    execute(action, props, event = null, ...otherEventParam) {
<<<<<<< HEAD
        const { name, handler, stop } = action;
        const e = this.createEvent(event, otherEventParam);
        if (stop && !isEmpty(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        return name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
    }
    invoke(actions, props, event = null, ...otherEventParam) {
        const _actions = (Array.isArray(actions) ? actions : [actions]).map(serializeAction);
        return toForkJoin(_actions.map(({ before }) => before && this.invoke(before, props, event, ...otherEventParam))).pipe(observableMap(() => forkJoin(_actions.map((action) => {
            return this.execute(action, props, event, ...otherEventParam);
        }))), observableTap((result) => !props ? of(null) : toForkJoin(_actions.map((action, index) => {
            return action.type && this.invokeCalculators(action, props, result[index], ...otherEventParam);
        }))), observableTap((result) => toForkJoin(_actions.map(({ after }, index) => {
            return after && this.invoke(after, props, typeof result[index] === 'undefined' ? event : result[index], ...otherEventParam);
        }))), map((result) => result.pop()));
=======
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
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
    }
    callAction(actionName, context, ...events) {
        return this.invoke(serializeAction(actionName), context, ...events);
    }
    executeAction(actionPropos, actionContext, [actionEvent, ...otherEvent] = this.createEvent(void (0))) {
        const { name = ``, handler } = serializeAction(actionPropos);
        const [actionName, execute = 'execute'] = name.match(/([^.]+)/ig) || [name];
        const context = Object.assign(Object.assign({}, actionContext), { actionPropos, actionEvent });
        let ActionType = null;
        let executeHandler = handler;
        let action = new BaseAction(this.injector, context);
        let builder = action.builder;
<<<<<<< HEAD
        if (!executeHandler && (ActionType = this.getAction(actionName))) {
            action = this.getCacheAction(ActionType, context, action);
=======
        let ActionType = null;
        if (!executeHandler && (ActionType = this.getAction(actionName))) {
            action = ActionType && new ActionType(this.injector, context);
>>>>>>> b725ec0019f64741ea9b3bccd3f6d0ae3ad37680
            executeHandler = action && action[execute].bind(action);
        }
        if (!executeHandler && builder) {
            while (builder) {
                executeHandler = builder.getExecuteHandler(name) || executeHandler;
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

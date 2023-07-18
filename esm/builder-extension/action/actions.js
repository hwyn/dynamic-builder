import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector, MethodProxy } from '@fm/di';
import { groupBy, isEmpty, toArray } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG, GET_TYPE } from '../../token';
import { funcToObservable, observableMap, observableTap, toForkJoin, transformObservable } from '../../utility';
import { serializeAction } from '../basic/basic.extension';
import { BaseAction } from './base.action';
let Action = class Action {
    constructor(mp, injector, getType) {
        this.mp = mp;
        this.injector = injector;
        this.getType = getType;
    }
    getCacheAction(ActionType, baseAction) {
        var _a;
        const { builder, context, actionProps: { _uid }, builderField } = baseAction;
        const { cacheAction = [] } = builderField || {};
        let cacheType = (_a = cacheAction.find(({ uid }) => _uid === uid)) === null || _a === void 0 ? void 0 : _a.action;
        if (!cacheType) {
            const injector = (builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector;
            cacheType = injector.get(ActionType).invoke(context);
            if (!ActionType.cache || !builderField || !_uid)
                return cacheType;
            builderField.cacheAction && cacheAction.push({ uid: _uid, action: cacheType });
        }
        return cacheType.invoke(context);
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
        const nonSelfBuilders = (builder === null || builder === void 0 ? void 0 : builder.$$cache.nonSelfBuilders) || [];
        const calculatorsInvokes = nonSelfBuilders.map((nonBuild) => this.invokeCallCalculators(nonBuild.nonSelfCalculators, actionProps, { builder: nonBuild, id }));
        calculatorsInvokes.push(this.invokeCallCalculators((builder === null || builder === void 0 ? void 0 : builder.calculators) || [], actionProps, props));
        return forkJoin(calculatorsInvokes.map((invokeCalculators) => invokeCalculators(value, ...otherEventParam)));
    }
    execute(action, props, event = null, ...otherEventParam) {
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
            return after && this.invoke(after, props, result[index], ...otherEventParam);
        }))), map((result) => result.pop()));
    }
    callAction(actionName, context, ...events) {
        return this.invoke(serializeAction(actionName), context, ...events);
    }
    executeAction(actionProps, actionContext, [actionEvent, ...otherEvent] = this.createEvent(void (0))) {
        const { name = ``, handler } = serializeAction(actionProps);
        const [actionName, execute = 'execute'] = name.match(/([^.]+)/ig) || [name];
        let ActionType = null;
        let executeHandler = handler;
        let action = new BaseAction().invoke(Object.assign(Object.assign({}, actionContext), { actionProps, actionEvent }));
        const builder = action.builder;
        action.injector = (builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector;
        if (!executeHandler && builder) {
            executeHandler = builder.getExecuteHandler(name, false);
        }
        if (!executeHandler && (ActionType = this.getType(ACTIONS_CONFIG, actionName))) {
            action = this.getCacheAction(ActionType, action);
            executeHandler = funcToObservable(this.mp.proxyMethodAsync(action, execute));
        }
        if (!executeHandler) {
            throw new Error(`${name} not defined!`);
        }
        return transformObservable(executeHandler.apply(undefined, [action, ...otherEvent]));
    }
};
Action = __decorate([
    __param(0, Inject(MethodProxy)),
    __param(1, Inject(Injector)),
    __param(2, Inject(GET_TYPE)),
    __metadata("design:paramtypes", [MethodProxy,
        Injector, Object])
], Action);
export { Action };

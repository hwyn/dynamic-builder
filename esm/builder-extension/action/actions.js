import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector, MethodProxy } from '@hwy-fm/di';
import { isEmpty } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CONFIG, GET_TYPE } from '../../token';
import { funcToObservable, observableMap, observableTap, serializeAction, toForkJoin, transformObservable } from '../../utility';
import { CALCULATOR } from '../constant/calculator.constant';
import { BaseAction } from './base.action';
import { EventZip } from './event-zip';
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
    createCallLinkType({ type, callLink = [] }, { id }, input, out) {
        return [...callLink, { fieldId: id, type, input, out }];
    }
    getActionContext({ builder, id } = {}) {
        return isEmpty(builder) ? {} : { builder, builderField: builder.getFieldById(id) };
    }
    execute(action, props, event = void (0), ...otherEvent) {
        const { name, handler, stop } = action;
        const e = this.createEvent(event, otherEvent);
        if (stop && !isEmpty(event) && (event === null || event === void 0 ? void 0 : event.stopPropagation)) {
            event.stopPropagation();
        }
        return name || handler ? this.executeAction(action, this.getActionContext(props), e) : of(event);
    }
    invoke(actions, props, event = void (0), ...otherEvent) {
        const _actions = (Array.isArray(actions) ? actions : [actions]).map(serializeAction);
        return toForkJoin(_actions.map(({ before }) => before && this.invoke(before, props, event, ...otherEvent))).pipe(observableMap(() => forkJoin(_actions.map((action) => {
            return this.execute(action, props, event, ...otherEvent);
        }))), observableTap((result) => !(props === null || props === void 0 ? void 0 : props.builder) ? of(void (0)) : toForkJoin(_actions.map((action, index) => {
            var _a;
            const { type } = action;
            if (type && type !== CALCULATOR && ((_a = props.builder.$$cache.eventHook) === null || _a === void 0 ? void 0 : _a.invokeCalculators)) {
                const callLink = this.createCallLinkType(action, props, event, result[index]);
                return props.builder.$$cache.eventHook.invokeCalculators(action, props, callLink, result[index], ...otherEvent);
            }
        }))), observableTap((result) => toForkJoin(_actions.map(({ after }, index) => {
            return after && this.invoke(after, props, result[index], ...otherEvent);
        }))), map((result) => result.pop()));
    }
    callAction(actionName, context, ...events) {
        return this.invoke(serializeAction(actionName), context, ...events);
    }
    executeAction(actionProps, actionContext, [actionEvent, ...otherEvent] = this.createEvent(void (0))) {
        const { name = ``, handler, params } = serializeAction(actionProps);
        const [actionName, execute = 'execute'] = name.match(/([^.]+)/ig) || [name];
        let ActionType = null;
        let executeHandler = handler;
        let action = new BaseAction().invoke(Object.assign(Object.assign({}, actionContext), { actionProps, actionEvent }));
        const builder = action.builder;
        action.injector = (builder === null || builder === void 0 ? void 0 : builder.injector) || this.injector;
        if (!executeHandler && builder && !(params === null || params === void 0 ? void 0 : params.ignoreBuilder)) {
            executeHandler = builder.getExecuteHandler(name, false);
        }
        if (!executeHandler && (ActionType = this.getType(ACTIONS_CONFIG, actionName))) {
            action = this.getCacheAction(ActionType, action);
            executeHandler = funcToObservable(this.mp.proxyMethod(action, execute));
        }
        if (!executeHandler) {
            throw new Error(`${name} not defined!`);
        }
        return transformObservable(executeHandler.apply(undefined, [
            actionEvent instanceof EventZip ? actionEvent.event : action,
            ...otherEvent
        ]));
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

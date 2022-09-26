"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActions = exports.getEventType = void 0;
const lodash_1 = require("lodash");
const token_1 = require("../../token");
const utility_1 = require("../../utility");
function mergeHandler(actions, props, options) {
    const actionIntercept = options.injector.get(token_1.ACTION_INTERCEPT);
    const isMore = actions.length > 1;
    const action = isMore ? actions : actions[0];
    const runObservable = actions.some(({ runObservable }) => runObservable);
    isMore && console.warn(`${props.id} Repeat listen event: ${actions[0].type}`);
    return (event, ...arg) => {
        const { interceptFn = () => event } = options;
        const obs = (0, utility_1.transformObservable)(interceptFn(props, event, ...arg)).pipe((0, utility_1.observableMap)((value) => actionIntercept.invoke(action, props, value, ...arg)));
        return runObservable ? obs : obs.subscribe();
    };
}
function getEventType(type) {
    return `on${type[0].toUpperCase()}${type.slice(1)}`;
}
exports.getEventType = getEventType;
const createActions = (actions, props, options) => {
    const events = (0, lodash_1.groupBy)(actions, 'type');
    return Object.keys(events).reduce((obj, type) => ({
        ...obj,
        [getEventType(type)]: mergeHandler(events[type], props, options)
    }), {});
};
exports.createActions = createActions;

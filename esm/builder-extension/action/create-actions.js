import { groupBy } from 'lodash';
import { ACTION_INTERCEPT } from '../../token';
import { observableMap, transformObservable } from '../../utility';
import { EventZip } from './event-zip';
function mergeHandler(actions, props, options) {
    const actionIntercept = options.injector.get(ACTION_INTERCEPT);
    const isMore = actions.length > 1;
    const runObservable = actions.some(({ runObservable }) => runObservable);
    isMore && console.warn(`${props.id} Repeat listen event: ${actions[0].type}`);
    return function eventHandler(event, ...arg) {
        const { interceptFn = () => event } = options;
        const obs = transformObservable(interceptFn(props, event, ...arg)).pipe(observableMap((value) => actionIntercept.invoke(actions, props, value, ...arg)));
        return runObservable || event instanceof EventZip ? obs : obs.subscribe();
    };
}
export function getEventType(type) {
    return `on${type[0].toUpperCase()}${type.slice(1)}`;
}
export function getActionType(type) {
    return type[2].toLowerCase() + type.slice(3);
}
export const createActions = (actions, props, options) => {
    const events = groupBy(actions, 'type');
    return Object.keys(events).reduce((obj, type) => (Object.assign(Object.assign({}, obj), { [getEventType(type)]: mergeHandler(events[type], props, options) })), {});
};

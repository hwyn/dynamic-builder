import { groupBy } from 'lodash';
import { ACTION_INTERCEPT } from '../../token';
import { observableMap, transformObservable } from '../../utility';
function mergeHandler(actions, props, options) {
    const actionIntercept = options.ls.getProvider(ACTION_INTERCEPT);
    const isMore = actions.length > 1;
    const action = isMore ? actions : actions[0];
    const runObservable = actions.some(({ runObservable }) => runObservable);
    isMore && console.warn(`${props.id} Repeat listen event: ${actions[0].type}`);
    return (event, ...arg) => {
        const { interceptFn = () => event } = options;
        const obs = transformObservable(interceptFn(props, event, ...arg)).pipe(observableMap((value) => actionIntercept.invoke(action, props, value, ...arg)));
        return runObservable ? obs : obs.subscribe();
    };
}
export function getEventType(type) {
    return `on${type[0].toUpperCase()}${type.slice(1)}`;
}
export const createActions = (actions, props, options) => {
    const events = groupBy(actions, 'type');
    return Object.keys(events).reduce((obj, type) => ({
        ...obj,
        [getEventType(type)]: mergeHandler(events[type], props, options)
    }), {});
};

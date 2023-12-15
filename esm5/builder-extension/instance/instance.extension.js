import { __extends } from "tslib";
import { isEmpty } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createDetectChanges, observableMap, toForkJoin, transformObservable, withValue } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CURRENT, DESTROY, INSTANCE, LOAD_ACTION, MOUNTED } from '../constant/calculator.constant';
var LISTENER_DETECT = 'listenerDetect';
var DETECT_CHANGES = 'detectChanges';
var InstanceExtension = /** @class */ (function (_super) {
    __extends(InstanceExtension, _super);
    function InstanceExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buildFieldList = [];
        return _this;
    }
    InstanceExtension.createInstance = function () {
        var _a;
        var listenerDetect = new Subject();
        var instance = {
            current: null,
            destroy: new Subject(),
            onMounted: function () { return void (0); },
            onDestroy: function () { return void (0); }
        };
        return Object.defineProperties(instance, (_a = {},
            _a[LISTENER_DETECT] = withValue(listenerDetect),
            _a[DETECT_CHANGES] = withValue(createDetectChanges(listenerDetect)),
            _a));
    };
    InstanceExtension.prototype.extension = function () {
        this.buildFieldList = this.mapFields(this.jsonFields, this.addInstance.bind(this));
        var handler = this.eachFields.bind(this, this.jsonFields, this.createInstanceLife.bind(this));
        this.pushCalculators(this.json, [{
                action: this.bindCalculatorAction(handler),
                dependents: { type: LOAD_ACTION, fieldId: this.builder.id }
            }]);
    };
    InstanceExtension.prototype.createInstanceLife = function (_a) {
        var _b;
        var builderField = _a[1];
        var instance = builderField.instance, _c = builderField.events, events = _c === void 0 ? {} : _c;
        this.defineProperties(instance, (_b = {},
            _b[this.getEventType(MOUNTED)] = events.onMounted,
            _b[this.getEventType(DESTROY)] = events.onDestroy,
            _b));
        Object.defineProperty(instance, CURRENT, this.getCurrentProperty(builderField));
        delete events.onMounted;
        delete events.onDestroy;
    };
    InstanceExtension.prototype.getCurrentProperty = function (_a) {
        var instance = _a.instance;
        var _current;
        var get = function () { return _current; };
        var set = function (current) {
            var hasMounted = !!current && _current !== current;
            _current = current;
            if (hasMounted) {
                instance.onMounted(current);
            }
        };
        return { get: get, set: set };
    };
    InstanceExtension.prototype.addInstance = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        var destroy = { type: DESTROY, after: this.bindCalculatorAction(this.instanceDestroy) };
        var instance = InstanceExtension.createInstance();
        this.pushAction(jsonField, [destroy, { type: MOUNTED }]);
        this.defineProperty(builderField, INSTANCE, instance);
    };
    InstanceExtension.prototype.instanceDestroy = function (_a) {
        var actionEvent = _a.actionEvent, instance = _a.builderField.instance;
        instance.current = null;
        instance.destroy.next(actionEvent);
    };
    InstanceExtension.prototype.beforeDestroy = function () {
        var _this = this;
        var showFields = this.buildFieldList.filter(function (_a) {
            var visibility = _a.visibility, instance = _a.instance;
            return _this.builder.showField(visibility) && instance.current;
        });
        if (!isEmpty(showFields)) {
            var subscriptions_1 = [];
            return toForkJoin(showFields.map(function (_a) {
                var id = _a.id, instance = _a.instance;
                return new Observable(function (subscribe) {
                    subscriptions_1.push(instance.destroy.subscribe(function () {
                        subscribe.next(id);
                        subscribe.complete();
                    }));
                });
            })).pipe(tap(function () { return subscriptions_1.forEach(function (s) { return s.unsubscribe(); }); }), observableMap(function () { return transformObservable(_super.prototype.beforeDestroy.call(_this)); }));
        }
    };
    InstanceExtension.prototype.destroy = function () {
        var _this = this;
        this.buildFieldList.forEach(function (buildField) {
            var instance = buildField.instance;
            instance.destroy.unsubscribe();
            instance.listenerDetect.unsubscribe();
            _this.unDefineProperty(instance, [DETECT_CHANGES, LISTENER_DETECT, _this.getEventType(DESTROY), _this.getEventType(MOUNTED), CURRENT]);
            _this.defineProperty(buildField, INSTANCE, null);
        });
        return _super.prototype.destroy.call(this);
    };
    return InstanceExtension;
}(BasicExtension));
export { InstanceExtension };

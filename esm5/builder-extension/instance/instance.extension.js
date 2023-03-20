import { __extends } from "tslib";
import { isEmpty } from 'lodash';
import { Observable, shareReplay, Subject, tap } from 'rxjs';
import { BuilderModel } from '../../builder/builder-model';
import { observableMap, toForkJoin, transformObservable } from '../../utility';
import { BasicExtension } from '../basic/basic.extension';
import { CURRENT, DESTROY, INSTANCE, LOAD_ACTION, MOUNTED } from '../constant/calculator.constant';
var InstanceExtension = /** @class */ (function (_super) {
    __extends(InstanceExtension, _super);
    function InstanceExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buildFieldList = [];
        return _this;
    }
    InstanceExtension.createInstance = function () {
        return {
            current: null,
            onMounted: function () { return void (0); },
            onDestroy: function () { return void (0); },
            detectChanges: function () { return undefined; },
            destroy: new Subject().pipe(shareReplay(1))
        };
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
        this.definePropertys(instance, (_b = {},
            _b[this.getEventType(MOUNTED)] = events.onMounted,
            _b[this.getEventType(DESTROY)] = events.onDestroy,
            _b));
        Object.defineProperty(instance, CURRENT, this.getCurrentProperty(builderField));
        delete events.onMounted;
        delete events.onDestroy;
    };
    InstanceExtension.prototype.getCurrentProperty = function (_a) {
        var instance = _a.instance, id = _a.id;
        var _current;
        var get = function () { return _current; };
        var set = function (current) {
            var hasMounted = !!current && _current !== current;
            _current = current;
            if (hasMounted) {
                instance.onMounted(id);
            }
            if (current instanceof BuilderModel && current.id !== id) {
                console.info("Builder needs to set the id property: ".concat(id));
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
        instance.destroy.subscribe();
    };
    InstanceExtension.prototype.instanceDestroy = function (_a) {
        var actionEvent = _a.actionEvent, instance = _a.builderField.instance;
        var currentIsBuildModel = instance.current instanceof BuilderModel;
        instance.current && (instance.current = null);
        instance.detectChanges = function () { return undefined; };
        return !currentIsBuildModel && instance.destroy.next(actionEvent);
    };
    InstanceExtension.prototype.beforeDestroy = function () {
        var _this = this;
        var showFields = this.buildFieldList.filter(function (_a) {
            var visibility = _a.visibility;
            return _this.builder.showField(visibility);
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
            _this.unDefineProperty(instance, ['detectChanges', _this.getEventType(DESTROY), _this.getEventType(MOUNTED), CURRENT]);
            _this.defineProperty(buildField, INSTANCE, null);
        });
        return _super.prototype.destroy.call(this);
    };
    return InstanceExtension;
}(BasicExtension));
export { InstanceExtension };

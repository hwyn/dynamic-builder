import { __rest, __spreadArray } from "tslib";
import { flatMap, isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BUILDER_EXTENSION, LOAD_BUILDER_CONFIG } from '../token';
import { cloneDeepPlain, createDetectChanges, observableMap, toForkJoin, transformObservable, withValue } from '../utility';
import { BuilderEngine } from './builder-engine.service';
var CACHE = "$$cache";
function createField(field) {
    var _a = cloneDeepPlain(field), id = _a.id, type = _a.type, visibility = _a.visibility, other = __rest(_a, ["id", "type", "visibility"]);
    var element = field.element || (typeof type !== 'string' ? type : this.injector.get(BuilderEngine).getUiComponent(type));
    var _field = { id: id, type: type, element: element, visibility: visibility, field: other };
    Object.keys(_field).forEach(function (key) { return _field[key] === undefined && delete _field[key]; });
    return _field;
}
function parseExtension(extension) {
    return extension.map(function (item) { return item.extension ? item : { extension: item }; });
}
function extendsProviders(child) {
    var _a;
    (_a = this.extension) === null || _a === void 0 ? void 0 : _a.forEach(function (extensionProvider) {
        var _a, _b;
        var needExtends = extensionProvider.needExtends, parentExtension = extensionProvider.extension;
        if (needExtends && !((_a = child.extension) === null || _a === void 0 ? void 0 : _a.some(function (_a) {
            var extension = _a.extension;
            return extension === parentExtension;
        }))) {
            (_b = child.extension) === null || _b === void 0 ? void 0 : _b.push(extensionProvider);
        }
    });
}
function addChild(child) {
    child.parent = this;
    this.children.push(child);
    !isEmpty(this.extension) && extendsProviders.call(this, child);
}
function removeChild(child) {
    this.children.splice(this.children.indexOf(child), 1);
    child.parent = null;
}
function destroy() {
    var _this = this;
    var cacheObj = this.$$cache;
    var _a = cacheObj.beforeDestroys, beforeDestroys = _a === void 0 ? [] : _a, _b = cacheObj.ready, ready = _b === void 0 ? false : _b, destroyed = cacheObj.destroyed;
    cacheObj.destroyed = true;
    if (ready && !destroyed) {
        transformObservable(this.destroy && this.destroy.call(this)).pipe(observableMap(function () { return toForkJoin(beforeDestroys.map(function (beforeDestroy) { return beforeDestroy && beforeDestroy(); })); }), observableMap(function (destroys) { return toForkJoin(destroys.map(function (destroy) { return destroy && destroy(); })); })).subscribe({
            next: function () {
                var _a;
                cacheObj.fields.splice(0);
                cacheObj.listenerDetect.unsubscribe();
                cacheObj.beforeDestroys.splice(0);
                _this.children.splice(0);
                (_a = _this.extension) === null || _a === void 0 ? void 0 : _a.splice(0);
                _this.parent && removeChild.call(_this.parent, _this);
                cacheObj.bindFn.forEach(function (fn) { return fn(); });
                cacheObj.bindFn.splice(0);
                Object.defineProperties(_this, { $$cache: withValue({ ready: false, destroyed: true }), onDestroy: withValue(null) });
            },
            error: function (e) {
                console.error(e);
            }
        });
    }
}
function getCacheObj(props) {
    var _a = props.config, _b = _a === void 0 ? {} : _a, _c = _b.fields, fields = _c === void 0 ? [] : _c;
    var _d = this.$$cache || {}, _e = _d.bindFn, bindFn = _e === void 0 ? [] : _e, _f = _d.ready, ready = _f === void 0 ? false : _f, _g = _d.destroyed, destroyed = _g === void 0 ? false : _g, detectChanges = _d.detectChanges, _h = _d.listenerDetect, listenerDetect = _h === void 0 ? new Subject() : _h, _j = _d.destroy, modelDestroy = _j === void 0 ? destroy.bind(this) : _j, _k = _d.addChild, modelAddChild = _k === void 0 ? addChild.bind(this) : _k, _l = _d.removeChild, modelRemoveChild = _l === void 0 ? removeChild.bind(this) : _l;
    return Object.assign(this.$$cache, {
        ready: ready,
        bindFn: bindFn,
        destroyed: destroyed,
        listenerDetect: listenerDetect,
        fieldsConfig: fields,
        destroy: modelDestroy,
        addChild: modelAddChild,
        removeChild: modelRemoveChild,
        fields: fields.map(createField.bind(this)),
        detectChanges: detectChanges !== null && detectChanges !== void 0 ? detectChanges : createDetectChanges(listenerDetect)
    });
}
function loadForBuild(props) {
    var _this = this;
    var LoadConfig = this.injector.get(LOAD_BUILDER_CONFIG);
    var extension = this.extension.map(function (_a) {
        var extension = _a.extension;
        return extension;
    });
    var Extensions = __spreadArray(__spreadArray([], flatMap(this.injector.get(BUILDER_EXTENSION)), true), extension, true);
    return new LoadConfig(this, props, this.$$cache).init().pipe(observableMap(function (loadExample) {
        Object.defineProperty(_this, CACHE, withValue(getCacheObj.call(_this, props)));
        var beforeInits = Extensions
            .map(function (Extension) { return new Extension(_this, props, _this.$$cache, props.config); })
            .map(function (extension) { return extension.init(); });
        return toForkJoin(__spreadArray([loadExample], beforeInits, true));
    }), observableMap(function (examples) { return toForkJoin(examples.map(function (example) { return example.afterInit(); })); }), tap(function (beforeDestroys) {
        _this.$$cache.ready = true;
        _this.$$cache.beforeDestroys = beforeDestroys;
        _this.$$cache.destroyed && destroy.apply(_this);
    }));
}
export function init() {
    var _this = this;
    Object.defineProperty(this, CACHE, withValue(getCacheObj.call(this, {})));
    Object.defineProperties(this, {
        onChange: withValue(this.onChange || (function () { return void (0); })),
        onDestroy: withValue(function () { var _a; return (_a = _this.$$cache) === null || _a === void 0 ? void 0 : _a.destroy(); }),
        loadForBuild: withValue(function (props) {
            delete _this.loadForBuild;
            Object.defineProperty(_this, 'extension', withValue(parseExtension(props.extension || [])));
            props.builder && addChild.call(props.builder, _this);
            loadForBuild.call(_this, props).subscribe(function () { return _this.detectChanges(); });
            return _this;
        })
    });
}

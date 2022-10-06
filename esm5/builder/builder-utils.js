import { __rest, __spreadArray } from "tslib";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BUILDER_EXTENSION, LOAD_BUILDER_CONFIG } from '../token';
import { observableMap, toForkJoin, transformObservable, withValue } from '../utility';
import { BuilderEngine } from './builder-engine.service';
export function init() {
    var _this = this;
    Object.defineProperty(this, '$$cache', withValue(getCacheObj.call(this, {})));
    Object.defineProperties(this, {
        onChange: withValue(function () { }),
        onDestory: withValue(this.$$cache.destory.bind(this)),
        loadForBuild: withValue(function (props) {
            delete _this.loadForBuild;
            Object.defineProperty(_this, 'privateExtension', withValue(props.privateExtension || []));
            props.builder && addChild.call(props.builder, _this);
            loadForBuild.call(_this, props).subscribe(function () { return _this.detectChanges(); });
            return _this;
        })
    });
}
function loadForBuild(props) {
    var _this = this;
    var LoadConfig = this.injector.get(LOAD_BUILDER_CONFIG);
    var privateExtension = this.privateExtension.map(function (_a) {
        var extension = _a.extension;
        return extension;
    });
    var Extensions = __spreadArray(__spreadArray([], this.injector.get(BUILDER_EXTENSION), true), privateExtension, true);
    return new LoadConfig(this, props, this.$$cache).init().pipe(observableMap(function (loadExample) {
        Object.defineProperty(_this, '$$cache', withValue(getCacheObj.call(_this, props)));
        var beforeInits = Extensions.map(function (Extension) { return new Extension(_this, props, _this.$$cache, props.config).init(); });
        return toForkJoin(__spreadArray([loadExample], beforeInits, true));
    }), observableMap(function (examples) { return toForkJoin(examples.map(function (example) { return example.afterInit(); })); }), tap(function (beforeDestorys) {
        _this.$$cache.ready = true;
        _this.$$cache.beforeDestorys = beforeDestorys;
        _this.$$cache.destoryed && destory.apply(_this);
    }));
}
function getCacheObj(props) {
    var _a = props.config, _b = _a === void 0 ? {} : _a, _c = _b.fields, fields = _c === void 0 ? [] : _c;
    var _d = this.$$cache || {}, _e = _d.ready, ready = _e === void 0 ? false : _e, _f = _d.destoryed, destoryed = _f === void 0 ? false : _f, _g = _d.detectChanges, detectChanges = _g === void 0 ? new Subject() : _g, _h = _d.destory, modelDestory = _h === void 0 ? destory.bind(this) : _h, _j = _d.addChild, modelAddChild = _j === void 0 ? addChild.bind(this) : _j, _k = _d.removeChild, modelRemoveChild = _k === void 0 ? removeChild.bind(this) : _k;
    return {
        ready: ready,
        destoryed: destoryed,
        detectChanges: detectChanges,
        destory: modelDestory,
        addChild: modelAddChild,
        removeChild: modelRemoveChild,
        fields: fields.map(createField.bind(this)),
    };
}
function createField(field) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var id = field.id, type = field.type, visibility = field.visibility, other = __rest(field, ["id", "type", "visibility"]);
    var element = field.element || this.injector.get(BuilderEngine).getUiComponent(type);
    var _field = { id: id, type: type, element: element, visibility: visibility, field: other };
    Object.keys(_field).forEach(function (key) { return _field[key] === undefined && delete _field[key]; });
    return _field;
}
function destory() {
    var _this = this;
    var cacheObj = this.$$cache;
    var _a = cacheObj.beforeDestorys, beforeDestorys = _a === void 0 ? [] : _a, _b = cacheObj.ready, ready = _b === void 0 ? false : _b, destoryed = cacheObj.destoryed;
    cacheObj.destoryed = true;
    if (ready && !destoryed) {
        try {
            transformObservable(this.destory && this.destory.call(this)).pipe(observableMap(function () { return toForkJoin(beforeDestorys.map(function (beforeDestory) { return beforeDestory && beforeDestory(); })); }), observableMap(function (destorys) { return toForkJoin(destorys.map(function (destory) { return destory && destory(); })); })).subscribe({
                next: function () {
                    var _a;
                    cacheObj.ready = false;
                    cacheObj.fields.splice(0);
                    cacheObj.detectChanges.unsubscribe();
                    cacheObj.beforeDestorys.splice(0);
                    _this.children.splice(0);
                    (_a = _this.privateExtension) === null || _a === void 0 ? void 0 : _a.splice(0);
                    _this.parent && removeChild.call(_this.parent, _this);
                },
                error: function (e) {
                    console.error(e);
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}
function extendsProviders(child) {
    var _a;
    (_a = this.privateExtension) === null || _a === void 0 ? void 0 : _a.forEach(function (extensionProvider) {
        var _a, _b;
        var needExtends = extensionProvider.needExtends, parentExtension = extensionProvider.extension;
        if (needExtends && !((_a = child.privateExtension) === null || _a === void 0 ? void 0 : _a.some(function (_a) {
            var extension = _a.extension;
            return extension === parentExtension;
        }))) {
            (_b = child.privateExtension) === null || _b === void 0 ? void 0 : _b.push(extensionProvider);
        }
    });
}
function addChild(child) {
    child.parent = this;
    this.children.push(child);
    !isEmpty(this.privateExtension) && extendsProviders.call(this, child);
}
function removeChild(child) {
    this.children.splice(this.children.indexOf(child), 1);
    child.parent = null;
}

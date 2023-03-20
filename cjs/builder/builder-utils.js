"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var token_1 = require("../token");
var utility_1 = require("../utility");
var builder_engine_service_1 = require("./builder-engine.service");
var CACHE = "$$cache";
function init() {
    var _this = this;
    Object.defineProperty(this, CACHE, (0, utility_1.withValue)(getCacheObj.call(this, {})));
    Object.defineProperties(this, {
        onChange: (0, utility_1.withValue)(function () { }),
        onDestroy: (0, utility_1.withValue)(function () { var _a; return (_a = _this.$$cache) === null || _a === void 0 ? void 0 : _a.destroy(); }),
        loadForBuild: (0, utility_1.withValue)(function (props) {
            delete _this.loadForBuild;
            Object.defineProperty(_this, 'privateExtension', (0, utility_1.withValue)(parseExtension(props.privateExtension || [])));
            props.builder && addChild.call(props.builder, _this);
            loadForBuild.call(_this, props).subscribe(function () { return _this.detectChanges(); });
            return _this;
        })
    });
}
exports.init = init;
function loadForBuild(props) {
    var _this = this;
    var LoadConfig = this.injector.get(token_1.LOAD_BUILDER_CONFIG);
    var privateExtension = this.privateExtension.map(function (_a) {
        var extension = _a.extension;
        return extension;
    });
    var Extensions = tslib_1.__spreadArray(tslib_1.__spreadArray([], (0, lodash_1.flatMap)(this.injector.get(token_1.BUILDER_EXTENSION)), true), privateExtension, true);
    return new LoadConfig(this, props, this.$$cache).init().pipe((0, utility_1.observableMap)(function (loadExample) {
        Object.defineProperty(_this, CACHE, (0, utility_1.withValue)(getCacheObj.call(_this, props)));
        var beforeInits = Extensions
            .map(function (Extension) { return new Extension(_this, props, _this.$$cache, props.config); })
            .map(function (extension) { return extension.init(); });
        return (0, utility_1.toForkJoin)(tslib_1.__spreadArray([loadExample], beforeInits, true));
    }), (0, utility_1.observableMap)(function (examples) { return (0, utility_1.toForkJoin)(examples.map(function (example) { return example.afterInit(); })); }), (0, operators_1.tap)(function (beforeDestroys) {
        _this.$$cache.ready = true;
        _this.$$cache.beforeDestroys = beforeDestroys;
        _this.$$cache.destroyed && destroy.apply(_this);
    }));
}
function getCacheObj(props) {
    var _a = props.config, _b = _a === void 0 ? {} : _a, _c = _b.fields, fields = _c === void 0 ? [] : _c;
    var _d = this.$$cache || {}, _e = _d.bindFn, bindFn = _e === void 0 ? [] : _e, _f = _d.ready, ready = _f === void 0 ? false : _f, _g = _d.destroyed, destroyed = _g === void 0 ? false : _g, _h = _d.detectChanges, detectChanges = _h === void 0 ? new rxjs_1.Subject() : _h, _j = _d.destroy, modelDestroy = _j === void 0 ? destroy.bind(this) : _j, _k = _d.addChild, modelAddChild = _k === void 0 ? addChild.bind(this) : _k, _l = _d.removeChild, modelRemoveChild = _l === void 0 ? removeChild.bind(this) : _l;
    return Object.assign(this.$$cache, {
        ready: ready,
        bindFn: bindFn,
        destroyed: destroyed,
        detectChanges: detectChanges,
        destroy: modelDestroy,
        addChild: modelAddChild,
        removeChild: modelRemoveChild,
        fields: fields.map(createField.bind(this)),
    });
}
function createField(field) {
    var _a = (0, utility_1.cloneDeepPlain)(field), id = _a.id, type = _a.type, visibility = _a.visibility, other = tslib_1.__rest(_a, ["id", "type", "visibility"]);
    var element = field.element || (typeof type !== 'string' ? type : this.injector.get(builder_engine_service_1.BuilderEngine).getUiComponent(type));
    var _field = { id: id, type: type, element: element, visibility: visibility, field: other };
    Object.keys(_field).forEach(function (key) { return _field[key] === undefined && delete _field[key]; });
    return _field;
}
function destroy() {
    var _this = this;
    var cacheObj = this.$$cache;
    var _a = cacheObj.beforeDestroys, beforeDestroys = _a === void 0 ? [] : _a, _b = cacheObj.ready, ready = _b === void 0 ? false : _b, destroyed = cacheObj.destroyed;
    cacheObj.destroyed = true;
    if (ready && !destroyed) {
        try {
            (0, utility_1.transformObservable)(this.destroy && this.destroy.call(this)).pipe((0, utility_1.observableMap)(function () { return (0, utility_1.toForkJoin)(beforeDestroys.map(function (beforeDestroy) { return beforeDestroy && beforeDestroy(); })); }), (0, utility_1.observableMap)(function (destroys) { return (0, utility_1.toForkJoin)(destroys.map(function (destroy) { return destroy && destroy(); })); })).subscribe({
                next: function () {
                    var _a;
                    cacheObj.fields.splice(0);
                    cacheObj.detectChanges.unsubscribe();
                    cacheObj.beforeDestroys.splice(0);
                    _this.children.splice(0);
                    (_a = _this.privateExtension) === null || _a === void 0 ? void 0 : _a.splice(0);
                    _this.parent && removeChild.call(_this.parent, _this);
                    cacheObj.bindFn.forEach(function (fn) { return fn(); });
                    cacheObj.bindFn.splice(0);
                    Object.defineProperties(_this, { $$cache: (0, utility_1.withValue)({ ready: false, destroyed: true }), onDestroy: (0, utility_1.withValue)(null) });
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
function parseExtension(privateExtension) {
    return privateExtension.map(function (item) { return item.extension ? item : { extension: item }; });
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
    !(0, lodash_1.isEmpty)(this.privateExtension) && extendsProviders.call(this, child);
}
function removeChild(child) {
    this.children.splice(this.children.indexOf(child), 1);
    child.parent = null;
}

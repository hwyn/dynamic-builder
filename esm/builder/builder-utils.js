import { __rest } from "tslib";
import { flatMap, isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BUILDER_EXTENSION, LOAD_BUILDER_CONFIG } from '../token';
import { cloneDeepPlain, createDetectChanges, observableMap, toForkJoin, transformObservable, withValue } from '../utility';
import { BuilderEngine } from './builder-engine.service';
const CACHE = `$$cache`;
function createField(field) {
    const _a = cloneDeepPlain(field), { id, type, visibility } = _a, other = __rest(_a, ["id", "type", "visibility"]);
    const element = field.element || (typeof type !== 'string' ? type : this.injector.get(BuilderEngine).getUiComponent(type));
    const _field = { id, type, element, visibility, field: other };
    Object.keys(_field).forEach((key) => _field[key] === undefined && delete _field[key]);
    return _field;
}
function parseExtension(privateExtension) {
    return privateExtension.map((item) => item.extension ? item : { extension: item });
}
function extendsProviders(child) {
    var _a;
    (_a = this.privateExtension) === null || _a === void 0 ? void 0 : _a.forEach((extensionProvider) => {
        var _a, _b;
        const { needExtends, extension: parentExtension } = extensionProvider;
        if (needExtends && !((_a = child.privateExtension) === null || _a === void 0 ? void 0 : _a.some(({ extension }) => extension === parentExtension))) {
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
function destroy() {
    const cacheObj = this.$$cache;
    const { beforeDestroys = [], ready = false, destroyed } = cacheObj;
    cacheObj.destroyed = true;
    if (ready && !destroyed) {
        try {
            transformObservable(this.destroy && this.destroy.call(this)).pipe(observableMap(() => toForkJoin(beforeDestroys.map((beforeDestroy) => beforeDestroy && beforeDestroy()))), observableMap((destroys) => toForkJoin(destroys.map((destroy) => destroy && destroy())))).subscribe({
                next: () => {
                    var _a;
                    cacheObj.fields.splice(0);
                    cacheObj.listenerDetect.unsubscribe();
                    cacheObj.beforeDestroys.splice(0);
                    this.children.splice(0);
                    (_a = this.privateExtension) === null || _a === void 0 ? void 0 : _a.splice(0);
                    this.parent && removeChild.call(this.parent, this);
                    cacheObj.bindFn.forEach((fn) => fn());
                    cacheObj.bindFn.splice(0);
                    Object.defineProperties(this, { $$cache: withValue({ ready: false, destroyed: true }), onDestroy: withValue(null) });
                },
                error: (e) => {
                    console.error(e);
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}
function getCacheObj(props) {
    const { config: { fields = [] } = {} } = props;
    const { bindFn = [], ready = false, destroyed = false, detectChanges, listenerDetect = new Subject(), destroy: modelDestroy = destroy.bind(this), addChild: modelAddChild = addChild.bind(this), removeChild: modelRemoveChild = removeChild.bind(this) } = this.$$cache || {};
    return Object.assign(this.$$cache, {
        ready,
        bindFn,
        destroyed,
        listenerDetect,
        destroy: modelDestroy,
        addChild: modelAddChild,
        removeChild: modelRemoveChild,
        fields: fields.map(createField.bind(this)),
        detectChanges: detectChanges !== null && detectChanges !== void 0 ? detectChanges : createDetectChanges(listenerDetect)
    });
}
function loadForBuild(props) {
    const LoadConfig = this.injector.get(LOAD_BUILDER_CONFIG);
    const privateExtension = this.privateExtension.map(({ extension }) => extension);
    const Extensions = [...flatMap(this.injector.get(BUILDER_EXTENSION)), ...privateExtension];
    return new LoadConfig(this, props, this.$$cache).init().pipe(observableMap((loadExample) => {
        Object.defineProperty(this, CACHE, withValue(getCacheObj.call(this, props)));
        const beforeInits = Extensions
            .map((Extension) => new Extension(this, props, this.$$cache, props.config))
            .map((extension) => extension.init());
        return toForkJoin([loadExample, ...beforeInits]);
    }), observableMap((examples) => toForkJoin(examples.map((example) => example.afterInit()))), tap((beforeDestroys) => {
        this.$$cache.ready = true;
        this.$$cache.beforeDestroys = beforeDestroys;
        this.$$cache.destroyed && destroy.apply(this);
    }));
}
export function init() {
    Object.defineProperty(this, CACHE, withValue(getCacheObj.call(this, {})));
    Object.defineProperties(this, {
        onChange: withValue(this.onChange || (() => void (0))),
        onDestroy: withValue(() => { var _a; return (_a = this.$$cache) === null || _a === void 0 ? void 0 : _a.destroy(); }),
        loadForBuild: withValue((props) => {
            delete this.loadForBuild;
            Object.defineProperty(this, 'privateExtension', withValue(parseExtension(props.privateExtension || [])));
            props.builder && addChild.call(props.builder, this);
            loadForBuild.call(this, props).subscribe(() => this.detectChanges());
            return this;
        })
    });
}

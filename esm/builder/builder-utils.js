import { __decorate, __metadata, __param, __rest } from "tslib";
import { deepProviders, Inject, InjectFlags, Injector } from '@fm/di';
import { flatMap, isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BUILDER_EXTENSION, LOAD_BUILDER_CONFIG, META_PROPS, META_TYPE, SCOPE_MODEL, SCOPE_PROPS } from '../token';
import { cloneDeepPlain, createDetectChanges, observableMap, toForkJoin, transformObservable, withValue } from '../utility';
import { BuilderEngine } from './builder-engine.service';
import { BuilderModel } from './builder-model';
import { BuilderScope } from './builder-scope';
import { BUILDER_DEF } from './decorator';
const CACHE = `$$cache`;
function createField(field) {
    const _a = cloneDeepPlain(field), { id, type, visibility } = _a, other = __rest(_a, ["id", "type", "visibility"]);
    const element = field.element || (typeof type !== 'string' ? type : this.injector.get(BuilderEngine).getUiComponent(type));
    const _field = { id, type, element, visibility, field: other };
    Object.keys(_field).forEach((key) => _field[key] === undefined && delete _field[key]);
    return _field;
}
function parseExtension(extension) {
    return extension.map((item) => item.extension ? item : { extension: item });
}
function extendsProviders(child) {
    var _a;
    (_a = this.extension) === null || _a === void 0 ? void 0 : _a.forEach((extensionProvider) => {
        var _a, _b;
        const { needExtends, extension: parentExtension } = extensionProvider;
        if (needExtends && !((_a = child.extension) === null || _a === void 0 ? void 0 : _a.some(({ extension }) => extension === parentExtension))) {
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
    const cacheObj = this.$$cache;
    const { beforeDestroys = [], ready = false, destroyed } = cacheObj;
    cacheObj.destroyed = true;
    if (ready && !destroyed) {
        transformObservable(this.destroy && this.destroy.call(this)).pipe(observableMap(() => toForkJoin(beforeDestroys.map((beforeDestroy) => beforeDestroy && beforeDestroy()))), observableMap((destroys) => toForkJoin(destroys.map((destroy) => destroy && destroy())))).subscribe({
            next: () => {
                var _a;
                cacheObj.fields.splice(0);
                cacheObj.listenerDetect.unsubscribe();
                cacheObj.beforeDestroys.splice(0);
                this.children.splice(0);
                (_a = this.extension) === null || _a === void 0 ? void 0 : _a.splice(0);
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
}
function getCacheObj(props) {
    const { config: { fields = [] } = {} } = props;
    const { bindFn = [], ready = false, destroyed = false, detectChanges, listenerDetect = new Subject(), destroy: modelDestroy = destroy.bind(this), addChild: modelAddChild = addChild.bind(this), removeChild: modelRemoveChild = removeChild.bind(this) } = this.$$cache || {};
    return Object.assign(this.$$cache, {
        ready,
        bindFn,
        destroyed,
        listenerDetect,
        fieldsConfig: fields,
        destroy: modelDestroy,
        addChild: modelAddChild,
        removeChild: modelRemoveChild,
        fields: fields.map(createField.bind(this)),
        detectChanges: detectChanges !== null && detectChanges !== void 0 ? detectChanges : createDetectChanges(listenerDetect)
    });
}
function loadForBuild(props) {
    const LoadConfig = this.injector.get(LOAD_BUILDER_CONFIG);
    const extension = this.extension.map(({ extension }) => extension);
    const Extensions = [...flatMap(this.injector.get(BUILDER_EXTENSION)), ...extension];
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
const _contextProvs = [
    BuilderScope,
    { provide: SCOPE_MODEL, useExisting: BuilderScope },
    { provide: META_PROPS, deps: [BuilderScope], useFactory: (builder) => builder.resetMetaTypeProps() }
];
let BuilderUtils = class BuilderUtils {
    constructor(injector) {
        this.injector = injector;
    }
    factory(props) {
        var _a, _b;
        let model;
        let _injector = (_b = (_a = props.builder) === null || _a === void 0 ? void 0 : _a.injector) !== null && _b !== void 0 ? _b : this.injector;
        const { BuilderModel: NB = BuilderModel, providers = [], context } = props, _props = __rest(props, ["BuilderModel", "providers", "context"]);
        if (NB[BUILDER_DEF] && !(Object.create(NB.prototype) instanceof BuilderModel)) {
            const _providers = [NB, { provide: META_TYPE, useExisting: NB }, _contextProvs, providers];
            _injector = Injector.create([{ provide: SCOPE_PROPS, useValue: { props: _props } }], _injector);
            context === null || context === void 0 ? void 0 : context.registryInjector(_injector);
            deepProviders(_injector, _providers);
            model = _injector.get(BuilderScope);
        }
        return model !== null && model !== void 0 ? model : _injector.get(NB, InjectFlags.NonCache);
    }
    builder(props) {
        const builder = this.factory(props);
        Object.defineProperties(builder, {
            [CACHE]: withValue(getCacheObj.call(builder, {})),
            onChange: withValue(builder.onChange || (() => void (0))),
            onDestroy: withValue(() => { var _a; return (_a = builder.$$cache) === null || _a === void 0 ? void 0 : _a.destroy(); }),
            extension: withValue(parseExtension(props.extension || []))
        });
        props.builder && addChild.call(props.builder, builder);
        loadForBuild.call(builder, props).subscribe(() => builder.detectChanges());
        return builder;
    }
};
BuilderUtils = __decorate([
    __param(0, Inject(Injector)),
    __metadata("design:paramtypes", [Injector])
], BuilderUtils);
export { BuilderUtils };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
const import_rxjs_1 = require("@fm/import-rxjs");
const lodash_1 = require("lodash");
const token_1 = require("../token");
const utility_1 = require("../utility");
const builder_engine_service_1 = require("./builder-engine.service");
function init() {
    Object.defineProperty(this, '$$cache', (0, utility_1.withValue)(getCacheObj.call(this, {})));
    Object.defineProperties(this, {
        onChange: (0, utility_1.withValue)(() => { }),
        onDestory: (0, utility_1.withValue)(this.$$cache.destory.bind(this)),
        loadForBuild: (0, utility_1.withValue)((props) => {
            delete this.loadForBuild;
            Object.defineProperty(this, 'privateExtension', (0, utility_1.withValue)(props.privateExtension || []));
            props.builder && addChild.call(props.builder, this);
            loadForBuild.call(this, props).subscribe(() => this.detectChanges());
            return this;
        })
    });
}
exports.init = init;
function loadForBuild(props) {
    const LoadConfig = this.ls.getProvider(token_1.LOAD_BUILDER_CONFIG);
    const privateExtension = this.privateExtension.map(({ extension }) => extension);
    const Extensions = [...this.ls.getProvider(token_1.BUILDER_EXTENSION), ...privateExtension];
    return new LoadConfig(this, props, this.$$cache).init().pipe((0, utility_1.observableMap)((loadExample) => {
        Object.defineProperty(this, '$$cache', (0, utility_1.withValue)(getCacheObj.call(this, props)));
        const beforeInits = Extensions.map((Extension) => new Extension(this, props, this.$$cache, props.config).init());
        return (0, utility_1.toForkJoin)([loadExample, ...beforeInits]);
    }), (0, utility_1.observableMap)((examples) => (0, utility_1.toForkJoin)(examples.map((example) => example.afterInit()))), (0, import_rxjs_1.tap)((beforeDestorys) => {
        this.$$cache.ready = true;
        this.$$cache.beforeDestorys = beforeDestorys;
        this.$$cache.destoryed && destory.apply(this);
    }));
}
function getCacheObj(props) {
    const { config: { fields = [] } = {} } = props;
    const { ready = false, destoryed = false, detectChanges = new import_rxjs_1.Subject(), destory: modelDestory = destory.bind(this), addChild: modelAddChild = addChild.bind(this), removeChild: modelRemoveChild = removeChild.bind(this) } = this.$$cache || {};
    return {
        ready,
        destoryed,
        detectChanges,
        destory: modelDestory,
        addChild: modelAddChild,
        removeChild: modelRemoveChild,
        fields: fields.map(createField.bind(this)),
    };
}
function createField(field) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, type, visibility, ...other } = field;
    const element = field.element || this.ls.getProvider(builder_engine_service_1.BuilderEngine).getUiComponent(type);
    const _field = { id, type, element, visibility, field: other };
    Object.keys(_field).forEach((key) => _field[key] === undefined && delete _field[key]);
    return _field;
}
function destory() {
    const cacheObj = this.$$cache;
    const { beforeDestorys = [], ready = false, destoryed } = cacheObj;
    cacheObj.destoryed = true;
    if (ready && !destoryed) {
        try {
            (0, utility_1.toForkJoin)(beforeDestorys.map((beforeDestory) => beforeDestory && beforeDestory())).pipe((0, utility_1.observableMap)((extensionDestorys) => (0, utility_1.toForkJoin)(extensionDestorys.map((extensionDestory) => extensionDestory && extensionDestory()))), (0, utility_1.observableMap)(() => (0, utility_1.transformObservable)(this.destory && this.destory.call(this)))).subscribe(() => {
                cacheObj.ready = false;
                cacheObj.fields.splice(0);
                cacheObj.detectChanges.unsubscribe();
                cacheObj.beforeDestorys.splice(0);
                this.children.splice(0);
                this.privateExtension?.splice(0);
                this.parent && removeChild.call(this.parent, this);
            }, (e) => {
                console.error(e);
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}
function extendsProviders(child) {
    this.privateExtension?.forEach((extensionProvider) => {
        const { needExtends, extension: parentExtension } = extensionProvider;
        if (needExtends && !child.privateExtension?.some(({ extension }) => extension === parentExtension)) {
            child.privateExtension?.push(extensionProvider);
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

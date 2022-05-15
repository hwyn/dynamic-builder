/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
import { Subject, tap } from '@fm/import-rxjs';
import { isEmpty } from 'lodash';
import { BUILDER_EXTENSION, LOAD_BUILDER_CONFIG } from '../token';
import { observableMap, toForkJoin, transformObservable, withValue } from '../utility';
import { BuilderEngine } from './builder-engine.service';
export function init() {
    Object.defineProperty(this, '$$cache', withValue(getCacheObj.call(this, {})));
    Object.defineProperties(this, {
        onChange: withValue(() => { }),
        onDestory: withValue(this.$$cache.destory.bind(this)),
        loadForBuild: withValue((props) => {
            delete this.loadForBuild;
            Object.defineProperty(this, 'privateExtension', withValue(props.privateExtension || []));
            props.builder && addChild.call(props.builder, this);
            loadForBuild.call(this, props).subscribe(() => this.detectChanges());
            return this;
        })
    });
}
function loadForBuild(props) {
    const LoadConfig = this.ls.getProvider(LOAD_BUILDER_CONFIG);
    const privateExtension = this.privateExtension.map(({ extension }) => extension);
    const Extensions = [...this.ls.getProvider(BUILDER_EXTENSION), ...privateExtension];
    return new LoadConfig(this, props, this.$$cache).init().pipe(observableMap((loadExample) => {
        Object.defineProperty(this, '$$cache', withValue(getCacheObj.call(this, props)));
        const beforeInits = Extensions.map((Extension) => new Extension(this, props, this.$$cache, props.config).init());
        return toForkJoin([loadExample, ...beforeInits]);
    }), observableMap((examples) => toForkJoin(examples.map((example) => example.afterInit()))), tap((beforeDestorys) => {
        this.$$cache.ready = true;
        this.$$cache.beforeDestorys = beforeDestorys;
        this.$$cache.destoryed && destory.apply(this);
    }));
}
function getCacheObj(props) {
    const { config: { fields = [] } = {} } = props;
    const { ready = false, destoryed = false, detectChanges = new Subject(), destory: modelDestory = destory.bind(this), addChild: modelAddChild = addChild.bind(this), removeChild: modelRemoveChild = removeChild.bind(this) } = this.$$cache || {};
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
    const element = field.element || this.ls.getProvider(BuilderEngine).getUiComponent(type);
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
            toForkJoin(beforeDestorys.map((beforeDestory) => beforeDestory && beforeDestory())).pipe(observableMap((extensionDestorys) => toForkJoin(extensionDestorys.map((extensionDestory) => extensionDestory && extensionDestory()))), observableMap(() => transformObservable(this.destory && this.destory.call(this)))).subscribe(() => {
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
    !isEmpty(this.privateExtension) && extendsProviders.call(this, child);
}
function removeChild(child) {
    this.children.splice(this.children.indexOf(child), 1);
    child.parent = null;
}

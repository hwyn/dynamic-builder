import { __decorate, __metadata } from "tslib";
import { Inject, Injector } from '@fm/di';
import { flatMap, isEmpty, uniq } from 'lodash';
import { init } from './builder-utils';
import { Visibility } from './consts';
import { DynamicModel } from './decorator';
var transform = function (_meta, value, type, prop) { var _a; return (_a = type[prop]) !== null && _a !== void 0 ? _a : value; };
var BuilderModel = /** @class */ (function () {
    function BuilderModel() {
        this.parent = null;
        this.children = [];
        this.$$cache = {};
        init.call(this);
    }
    BuilderModel.prototype.getFieldByTypes = function (type) {
        var _a = this.$$cache.fields, fields = _a === void 0 ? [] : _a;
        return fields.filter(function (_a) {
            var fieldType = _a.type;
            return fieldType === type;
        });
    };
    BuilderModel.prototype.getAllFieldByTypes = function (type) {
        var fields = this.getFieldByTypes(type);
        this.children.forEach(function (child) { return fields.push.apply(fields, child.getAllFieldByTypes(type)); });
        return fields;
    };
    BuilderModel.prototype.getFieldById = function (id) {
        var _a;
        var hasSelf = id === this.id && !!this.parent;
        var _b = this.$$cache.fields, fields = _b === void 0 ? [] : _b;
        return hasSelf ? (_a = this.parent) === null || _a === void 0 ? void 0 : _a.getFieldById(id) : fields.find(function (_a) {
            var fieldId = _a.id;
            return fieldId === id;
        });
    };
    BuilderModel.prototype.getAllFieldById = function (id) {
        var fields = flatMap(this.children.map(function (child) { return child.getAllFieldById(id); }));
        fields.push(this.getFieldById(id));
        return uniq(fields.filter(function (field) { return !isEmpty(field); }));
    };
    BuilderModel.prototype.detectChanges = function () {
        if (!this.$$cache.destroyed && this.ready) {
            this.$$cache.detectChanges(this);
        }
    };
    Object.defineProperty(BuilderModel.prototype, "listenerDetect", {
        get: function () {
            return this.$$cache.listenerDetect;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderModel.prototype, "ready", {
        get: function () {
            return this.$$cache.ready;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderModel.prototype, "root", {
        get: function () {
            return (this.parent ? this.parent.root : this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderModel.prototype, "fields", {
        get: function () {
            var _this = this;
            var _a = this.$$cache.fields, fields = _a === void 0 ? [] : _a;
            return fields.filter(function (_a) {
                var visibility = _a.visibility;
                return _this.showField(visibility);
            });
        },
        enumerable: false,
        configurable: true
    });
    BuilderModel.prototype.showField = function (visibility) {
        return visibility === undefined || visibility !== Visibility.none;
    };
    __decorate([
        Inject(Injector, { transform: transform }),
        __metadata("design:type", Injector)
    ], BuilderModel.prototype, "injector", void 0);
    BuilderModel = __decorate([
        DynamicModel(),
        __metadata("design:paramtypes", [])
    ], BuilderModel);
    return BuilderModel;
}());
export { BuilderModel };

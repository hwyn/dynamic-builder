import { flatMap, isEmpty, uniq } from 'lodash';
import { init } from './builder-utils';
import { Visibility } from './consts';
var BuilderModel = /** @class */ (function () {
    function BuilderModel(injector) {
        this.injector = injector;
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
        if (!this.$$cache.destoryed) {
            this.$$cache.detectChanges.next(this);
        }
    };
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
    return BuilderModel;
}());
export { BuilderModel };

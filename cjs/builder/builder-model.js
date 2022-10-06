"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderModel = void 0;
var lodash_1 = require("lodash");
var builder_utils_1 = require("./builder-utils");
var consts_1 = require("./consts");
var BuilderModel = /** @class */ (function () {
    function BuilderModel(injector) {
        this.injector = injector;
        this.parent = null;
        this.children = [];
        this.$$cache = {};
        builder_utils_1.init.call(this);
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
        var fields = (0, lodash_1.flatMap)(this.children.map(function (child) { return child.getAllFieldById(id); }));
        fields.push(this.getFieldById(id));
        return (0, lodash_1.uniq)(fields.filter(function (field) { return !(0, lodash_1.isEmpty)(field); }));
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
        return visibility === undefined || visibility !== consts_1.Visibility.none;
    };
    return BuilderModel;
}());
exports.BuilderModel = BuilderModel;

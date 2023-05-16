"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderModel = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var builder_utils_1 = require("./builder-utils");
var consts_1 = require("./consts");
var decorator_1 = require("./decorator");
var transform = function (_meta, value, type, prop) { var _a; return (_a = type[prop]) !== null && _a !== void 0 ? _a : value; };
var BuilderModel = /** @class */ (function () {
    function BuilderModel() {
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
        if (!this.$$cache.destroyed && this.ready) {
            this.listenerDetect.next(this);
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
        return visibility === undefined || visibility !== consts_1.Visibility.none;
    };
    tslib_1.__decorate([
        (0, di_1.Inject)(di_1.Injector, { transform: transform }),
        tslib_1.__metadata("design:type", di_1.Injector)
    ], BuilderModel.prototype, "injector", void 0);
    BuilderModel = tslib_1.__decorate([
        (0, decorator_1.DynamicModel)(),
        tslib_1.__metadata("design:paramtypes", [])
    ], BuilderModel);
    return BuilderModel;
}());
exports.BuilderModel = BuilderModel;

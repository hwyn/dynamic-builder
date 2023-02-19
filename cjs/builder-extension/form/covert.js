"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Covert = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var token_1 = require("../../token");
var Covert = /** @class */ (function () {
    function Covert(injector, coverts) {
        this.injector = injector;
        this.coverts = (0, lodash_1.flatMap)(coverts);
    }
    Covert.prototype.covertToModel = function (covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.covertToModel(value)) || value;
    };
    Covert.prototype.covertToView = function (covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.covertToView(value)) || value;
    };
    Covert.prototype.getCovertObj = function (covertObj, builder, builderField) {
        var name = (0, lodash_1.isString)(covertObj) ? covertObj : covertObj === null || covertObj === void 0 ? void 0 : covertObj.name;
        var _a = this.coverts.filter(function (_a) {
            var covertName = _a.name;
            return covertName === name;
        })[0], _b = _a === void 0 ? {} : _a, _c = _b.covert, covert = _c === void 0 ? null : _c;
        if (name && !covert) {
            console.info("covert: ".concat(name, "\u6CA1\u6709\u88AB\u6CE8\u518C!!"));
        }
        var covertType = covert && new covert(builder.injector || this.injector);
        if (covertType) {
            covertType.covert = covertObj;
            covertType.builder = builder;
            covertType.builderField = builderField;
        }
        return covertType;
    };
    Covert = tslib_1.__decorate([
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__param(1, (0, di_1.Inject)(token_1.COVERT_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector, Array])
    ], Covert);
    return Covert;
}());
exports.Covert = Covert;

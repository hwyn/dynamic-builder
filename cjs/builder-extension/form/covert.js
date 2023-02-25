"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Covert = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var token_1 = require("../../token");
var base_covert_1 = require("./base-covert");
var Covert = /** @class */ (function () {
    function Covert(injector, getType) {
        this.injector = injector;
        this.getType = getType;
    }
    Covert.prototype.toModel = function (covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.toModel(value)) || value;
    };
    Covert.prototype.toView = function (covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.toView(value)) || value;
    };
    Covert.prototype.getCovertObj = function (covertObj, builder, builderField) {
        var name = (0, lodash_1.isString)(covertObj) ? covertObj : covertObj === null || covertObj === void 0 ? void 0 : covertObj.name;
        var covert = covertObj instanceof base_covert_1.BaseCovert ? covertObj : this.getType(token_1.COVERT_CONFIG, name);
        if (name && !covert) {
            console.info("covert: ".concat(name, "\u6CA1\u6709\u88AB\u6CE8\u518C!!"));
        }
        var covertType = covert && new covert(builder.injector || this.injector);
        return covertType && covertType.invoke({ covertObj: covertObj, builder: builder, builderField: builderField });
    };
    Covert = tslib_1.__decorate([
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__param(1, (0, di_1.Inject)(token_1.GET_TYPE)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector, Object])
    ], Covert);
    return Covert;
}());
exports.Covert = Covert;

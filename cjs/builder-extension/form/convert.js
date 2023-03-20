"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var token_1 = require("../../token");
var base_convert_1 = require("./base-convert");
var Convert = /** @class */ (function () {
    function Convert(injector, getType) {
        this.injector = injector;
        this.getType = getType;
    }
    Convert.prototype.toModel = function (convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toModel(value)) || value;
    };
    Convert.prototype.toView = function (convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toView(value)) || value;
    };
    Convert.prototype.getConvertObj = function (covertConfig, builder, builderField) {
        var name = (0, lodash_1.isString)(covertConfig) ? covertConfig : covertConfig === null || covertConfig === void 0 ? void 0 : covertConfig.name;
        var convert = covertConfig instanceof base_convert_1.BaseConvert ? covertConfig : this.getType(token_1.CONVERT_CONFIG, name);
        if (name && !convert) {
            console.info("convert: ".concat(name, "\u6CA1\u6709\u88AB\u6CE8\u518C!!"));
        }
        var converter = convert && new convert(builder.injector || this.injector);
        return converter && converter.invoke({ covertConfig: covertConfig, builder: builder, builderField: builderField });
    };
    Convert = tslib_1.__decorate([
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__param(1, (0, di_1.Inject)(token_1.GET_TYPE)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector, Object])
    ], Convert);
    return Convert;
}());
exports.Convert = Convert;

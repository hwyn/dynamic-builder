"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var rxjs_1 = require("rxjs");
var token_1 = require("../../token");
var basic_extension_1 = require("../basic/basic.extension");
var base_convert_1 = require("./base-convert");
var Convert = /** @class */ (function () {
    function Convert(injector, getType) {
        this.injector = injector;
        this.getType = getType;
    }
    Convert.prototype.toModel = function (convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toModel) ? convertObj.toModel(value) : value;
    };
    Convert.prototype.toView = function (convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toView) ? convertObj.toView(value) : value;
    };
    Convert.prototype.getConvertObj = function (convertConfig, builder, builderField) {
        var converter;
        var context = { injector: this.injector, convertConfig: convertConfig, builder: builder, builderField: builderField };
        var _a = (0, basic_extension_1.serializeAction)(convertConfig), name = _a.name, _b = _a.handler, handler = _b === void 0 ? name && builder.getExecuteHandler(name, false) : _b;
        if (handler) {
            var result = handler(new base_convert_1.BaseConvert().invoke(context));
            ((0, rxjs_1.isObservable)(result) ? result : (0, rxjs_1.of)(result)).subscribe(function (obj) { return converter = obj; });
        }
        if (!converter) {
            var convert = convertConfig instanceof base_convert_1.BaseConvert ? convertConfig : this.getType(token_1.CONVERT_CONFIG, name);
            if (name && !convert) {
                console.info("convert: ".concat(name, "\u6CA1\u6709\u88AB\u6CE8\u518C!!"));
            }
            converter = convert && this.injector.get(convert).invoke(context);
        }
        return converter;
    };
    Convert = tslib_1.__decorate([
        tslib_1.__param(0, (0, di_1.Inject)(di_1.Injector)),
        tslib_1.__param(1, (0, di_1.Inject)(token_1.GET_TYPE)),
        tslib_1.__metadata("design:paramtypes", [di_1.Injector, Object])
    ], Convert);
    return Convert;
}());
exports.Convert = Convert;

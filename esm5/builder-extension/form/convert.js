import { __assign, __decorate, __metadata, __param } from "tslib";
import { Inject, Injector } from '@fm/di';
import { isString } from 'lodash';
import { CONVERT_CONFIG, GET_TYPE } from '../../token';
import { BaseConvert } from './base-convert';
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
        var context = { convertConfig: convertConfig, builder: builder, builderField: builderField };
        var name = isString(convertConfig) ? convertConfig : convertConfig === null || convertConfig === void 0 ? void 0 : convertConfig.name;
        var builderHandler = builder.getExecuteHandler(name, false);
        if (builderHandler) {
            converter = builderHandler(new BaseConvert().invoke(__assign({ injector: this.injector }, context)));
        }
        if (!converter) {
            var convert = convertConfig instanceof BaseConvert ? convertConfig : this.getType(CONVERT_CONFIG, name);
            if (name && !convert) {
                console.info("convert: ".concat(name, "\u6CA1\u6709\u88AB\u6CE8\u518C!!"));
            }
            converter = convert && this.injector.get(convert).invoke(context);
        }
        return converter;
    };
    Convert = __decorate([
        __param(0, Inject(Injector)),
        __param(1, Inject(GET_TYPE)),
        __metadata("design:paramtypes", [Injector, Object])
    ], Convert);
    return Convert;
}());
export { Convert };

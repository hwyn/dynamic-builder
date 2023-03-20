import { __decorate, __metadata, __param } from "tslib";
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
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toModel(value)) || value;
    };
    Convert.prototype.toView = function (convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toView(value)) || value;
    };
    Convert.prototype.getConvertObj = function (covertConfig, builder, builderField) {
        var name = isString(covertConfig) ? covertConfig : covertConfig === null || covertConfig === void 0 ? void 0 : covertConfig.name;
        var convert = covertConfig instanceof BaseConvert ? covertConfig : this.getType(CONVERT_CONFIG, name);
        if (name && !convert) {
            console.info("convert: ".concat(name, "\u6CA1\u6709\u88AB\u6CE8\u518C!!"));
        }
        var converter = convert && new convert(builder.injector || this.injector);
        return converter && converter.invoke({ covertConfig: covertConfig, builder: builder, builderField: builderField });
    };
    Convert = __decorate([
        __param(0, Inject(Injector)),
        __param(1, Inject(GET_TYPE)),
        __metadata("design:paramtypes", [Injector, Object])
    ], Convert);
    return Convert;
}());
export { Convert };

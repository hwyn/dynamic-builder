import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector } from '@fm/di';
import { isObservable, of } from 'rxjs';
import { CONVERT_CONFIG, GET_TYPE } from '../../token';
import { serializeAction } from '../basic/basic.extension';
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
        var context = { injector: this.injector, convertConfig: convertConfig, builder: builder, builderField: builderField };
        var _a = serializeAction(convertConfig), name = _a.name, _b = _a.handler, handler = _b === void 0 ? name && builder.getExecuteHandler(name, false) : _b;
        if (handler) {
            var result = handler(new BaseConvert().invoke(context));
            (isObservable(result) ? result : of(result)).subscribe(function (obj) { return converter = obj; });
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

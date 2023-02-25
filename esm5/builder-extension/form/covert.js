import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector } from '@fm/di';
import { isString } from 'lodash';
import { COVERT_CONFIG, GET_TYPE } from '../../token';
import { BaseCovert } from './base-covert';
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
        var name = isString(covertObj) ? covertObj : covertObj === null || covertObj === void 0 ? void 0 : covertObj.name;
        var covert = covertObj instanceof BaseCovert ? covertObj : this.getType(COVERT_CONFIG, name);
        if (name && !covert) {
            console.info("covert: ".concat(name, "\u6CA1\u6709\u88AB\u6CE8\u518C!!"));
        }
        var covertType = covert && new covert(builder.injector || this.injector);
        return covertType && covertType.invoke({ covertObj: covertObj, builder: builder, builderField: builderField });
    };
    Covert = __decorate([
        __param(0, Inject(Injector)),
        __param(1, Inject(GET_TYPE)),
        __metadata("design:paramtypes", [Injector, Object])
    ], Covert);
    return Covert;
}());
export { Covert };

import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector } from '@fm/di';
import { flatMap, isString } from 'lodash';
import { COVERT_CONFIG } from '../../token';
var Covert = /** @class */ (function () {
    function Covert(injector, coverts) {
        this.injector = injector;
        this.coverts = flatMap(coverts);
    }
    Covert.prototype.covertToModel = function (covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.covertToModel(value)) || value;
    };
    Covert.prototype.covertToView = function (covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.covertToView(value)) || value;
    };
    Covert.prototype.getCovertObj = function (covertObj, builder, builderField) {
        var name = isString(covertObj) ? covertObj : covertObj === null || covertObj === void 0 ? void 0 : covertObj.name;
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
    Covert = __decorate([
        __param(0, Inject(Injector)),
        __param(1, Inject(COVERT_CONFIG)),
        __metadata("design:paramtypes", [Injector, Array])
    ], Covert);
    return Covert;
}());
export { Covert };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConvert = void 0;
var BaseConvert = /** @class */ (function () {
    function BaseConvert(injector) {
        this.injector = injector;
    }
    BaseConvert.prototype.invoke = function (context) {
        return Object.assign(this, context);
    };
    return BaseConvert;
}());
exports.BaseConvert = BaseConvert;

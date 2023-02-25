"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCovert = void 0;
var BaseCovert = /** @class */ (function () {
    function BaseCovert(injector) {
        this.injector = injector;
    }
    BaseCovert.prototype.invoke = function (context) {
        return Object.assign(this, context);
    };
    return BaseCovert;
}());
exports.BaseCovert = BaseCovert;

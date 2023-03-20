var BaseConvert = /** @class */ (function () {
    function BaseConvert(injector) {
        this.injector = injector;
    }
    BaseConvert.prototype.invoke = function (context) {
        return Object.assign(this, context);
    };
    return BaseConvert;
}());
export { BaseConvert };

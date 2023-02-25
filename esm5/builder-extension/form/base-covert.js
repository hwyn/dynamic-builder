var BaseCovert = /** @class */ (function () {
    function BaseCovert(injector) {
        this.injector = injector;
    }
    BaseCovert.prototype.invoke = function (context) {
        return Object.assign(this, context);
    };
    return BaseCovert;
}());
export { BaseCovert };

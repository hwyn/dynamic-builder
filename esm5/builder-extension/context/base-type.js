import { __decorate, __metadata } from "tslib";
import { Inject, Injector } from '@hwy-fm/di';
var BaseType = /** @class */ (function () {
    function BaseType() {
    }
    BaseType.prototype.invoke = function (context) {
        if (context === void 0) { context = {}; }
        return Object.assign(this, context);
    };
    __decorate([
        Inject(Injector),
        __metadata("design:type", Injector)
    ], BaseType.prototype, "injector", void 0);
    return BaseType;
}());
export { BaseType };

import { __decorate, __metadata } from "tslib";
import { Inject, Injector } from '@fm/di';
var BaseType = /** @class */ (function () {
    function BaseType() {
    }
    __decorate([
        Inject(Injector),
        __metadata("design:type", Injector)
    ], BaseType.prototype, "injector", void 0);
    return BaseType;
}());
export { BaseType };

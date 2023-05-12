import { __decorate, __metadata } from "tslib";
import { Inject, Injector } from '@fm/di';
export class BaseType {
    invoke(context = {}) {
        return Object.assign(this, { context });
    }
}
__decorate([
    Inject(Injector),
    __metadata("design:type", Injector)
], BaseType.prototype, "injector", void 0);

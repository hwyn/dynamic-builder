"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseType = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var BaseType = /** @class */ (function () {
    function BaseType() {
    }
    BaseType.prototype.invoke = function (context) {
        if (context === void 0) { context = {}; }
        return Object.assign(this, context);
    };
    tslib_1.__decorate([
        (0, di_1.Inject)(di_1.Injector),
        tslib_1.__metadata("design:type", di_1.Injector)
    ], BaseType.prototype, "injector", void 0);
    return BaseType;
}());
exports.BaseType = BaseType;

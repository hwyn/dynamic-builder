"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConvert = void 0;
var tslib_1 = require("tslib");
var base_type_1 = require("../context/base-type");
var BaseConvert = /** @class */ (function (_super) {
    tslib_1.__extends(BaseConvert, _super);
    function BaseConvert() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseConvert.prototype.invoke = function (context) {
        return Object.assign(this, context);
    };
    return BaseConvert;
}(base_type_1.BaseType));
exports.BaseConvert = BaseConvert;

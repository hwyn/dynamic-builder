import { __extends } from "tslib";
import { BaseType } from '../context/base-type';
var BaseConvert = /** @class */ (function (_super) {
    __extends(BaseConvert, _super);
    function BaseConvert() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseConvert.prototype.invoke = function (context) {
        return Object.assign(this, context);
    };
    return BaseConvert;
}(BaseType));
export { BaseConvert };

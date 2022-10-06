import { __extends } from "tslib";
import { BasicExtension } from '../basic/basic.extension';
var MetadataExtension = /** @class */ (function (_super) {
    __extends(MetadataExtension, _super);
    function MetadataExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MetadataExtension.prototype.extension = function () {
        var _this = this;
        var metadataFields = this.jsonFields.filter(function (_a) {
            var metadata = _a.metadata;
            return !!metadata;
        });
        this.eachFields(metadataFields, function (_a) {
            var builderField = _a[1];
            var field = builderField.field, metadata = builderField.field.metadata;
            _this.defineProperty(builderField, 'metadata', metadata);
            delete field.metadata;
        });
    };
    return MetadataExtension;
}(BasicExtension));
export { MetadataExtension };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataExtension = void 0;
const basic_extension_1 = require("../basic/basic.extension");
class MetadataExtension extends basic_extension_1.BasicExtension {
    extension() {
        const metadataFields = this.jsonFields.filter(({ metadata }) => !!metadata);
        this.eachFields(metadataFields, ([, builderField]) => {
            const { field, field: { metadata } } = builderField;
            this.defineProperty(builderField, 'metadata', metadata);
            delete field.metadata;
        });
    }
}
exports.MetadataExtension = MetadataExtension;

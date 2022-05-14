import { BasicExtension } from '../basic/basic.extension';
export class MetadataExtension extends BasicExtension {
    extension() {
        const metadataFields = this.jsonFields.filter(({ metadata }) => !!metadata);
        this.eachFields(metadataFields, ([, builderField]) => {
            const { field, field: { metadata } } = builderField;
            this.defineProperty(builderField, 'metadata', metadata);
            delete field.metadata;
        });
    }
}

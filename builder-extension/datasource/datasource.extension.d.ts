import { BasicExtension } from '../basic/basic.extension';
export declare class DataSourceExtension extends BasicExtension {
    private builderFields;
    protected extension(): void;
    private addFieldCalculators;
    private createSourceConfig;
    private createOnDataSourceConfig;
    private serializeDataSourceConfig;
    private sourceToMetadata;
}

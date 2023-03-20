import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector } from '@fm/di';
import { isString } from 'lodash';
import { CONVERT_CONFIG, GET_TYPE } from '../../token';
import { BaseConvert } from './base-convert';
let Convert = class Convert {
    constructor(injector, getType) {
        this.injector = injector;
        this.getType = getType;
    }
    toModel(convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toModel(value)) || value;
    }
    toView(convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toView(value)) || value;
    }
    getConvertObj(covertConfig, builder, builderField) {
        const name = isString(covertConfig) ? covertConfig : covertConfig === null || covertConfig === void 0 ? void 0 : covertConfig.name;
        const convert = covertConfig instanceof BaseConvert ? covertConfig : this.getType(CONVERT_CONFIG, name);
        if (name && !convert) {
            console.info(`convert: ${name}没有被注册!!`);
        }
        const converter = convert && new convert(builder.injector || this.injector);
        return converter && converter.invoke({ covertConfig, builder, builderField });
    }
};
Convert = __decorate([
    __param(0, Inject(Injector)),
    __param(1, Inject(GET_TYPE)),
    __metadata("design:paramtypes", [Injector, Object])
], Convert);
export { Convert };

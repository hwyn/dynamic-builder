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
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toModel) ? convertObj.toModel(value) : value;
    }
    toView(convertObj, value) {
        return (convertObj === null || convertObj === void 0 ? void 0 : convertObj.toView) ? convertObj.toView(value) : value;
    }
    getConvertObj(convertConfig, builder, builderField) {
        let converter;
        const context = { injector: this.injector, convertConfig, builder, builderField };
        const name = isString(convertConfig) ? convertConfig : convertConfig === null || convertConfig === void 0 ? void 0 : convertConfig.name;
        const builderHandler = builder.getExecuteHandler(name, false);
        if (builderHandler) {
            builderHandler(new BaseConvert().invoke(context)).subscribe((obj) => converter = obj);
        }
        if (!converter) {
            const convert = convertConfig instanceof BaseConvert ? convertConfig : this.getType(CONVERT_CONFIG, name);
            if (name && !convert) {
                console.info(`convert: ${name}没有被注册!!`);
            }
            converter = convert && this.injector.get(convert).invoke(context);
        }
        return converter;
    }
};
Convert = __decorate([
    __param(0, Inject(Injector)),
    __param(1, Inject(GET_TYPE)),
    __metadata("design:paramtypes", [Injector, Object])
], Convert);
export { Convert };

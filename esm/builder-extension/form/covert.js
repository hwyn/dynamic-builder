import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector } from '@fm/di';
import { isString } from 'lodash';
import { COVERT_CONFIG, GET_TYPE } from '../../token';
import { BaseCovert } from './base-covert';
let Covert = class Covert {
    constructor(injector, getType) {
        this.injector = injector;
        this.getType = getType;
    }
    toModel(covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.toModel(value)) || value;
    }
    toView(covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.toView(value)) || value;
    }
    getCovertObj(covertObj, builder, builderField) {
        const name = isString(covertObj) ? covertObj : covertObj === null || covertObj === void 0 ? void 0 : covertObj.name;
        const covert = covertObj instanceof BaseCovert ? covertObj : this.getType(COVERT_CONFIG, name);
        if (name && !covert) {
            console.info(`covert: ${name}没有被注册!!`);
        }
        const covertType = covert && new covert(builder.injector || this.injector);
        return covertType && covertType.invoke({ covertObj, builder, builderField });
    }
};
Covert = __decorate([
    __param(0, Inject(Injector)),
    __param(1, Inject(GET_TYPE)),
    __metadata("design:paramtypes", [Injector, Object])
], Covert);
export { Covert };

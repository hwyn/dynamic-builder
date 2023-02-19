import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injector } from '@fm/di';
import { flatMap, isString } from 'lodash';
import { COVERT_CONFIG } from '../../token';
let Covert = class Covert {
    constructor(injector, coverts) {
        this.injector = injector;
        this.coverts = flatMap(coverts);
    }
    covertToModel(covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.covertToModel(value)) || value;
    }
    covertToView(covertType, value) {
        return (covertType === null || covertType === void 0 ? void 0 : covertType.covertToView(value)) || value;
    }
    getCovertObj(covertObj, builder, builderField) {
        const name = isString(covertObj) ? covertObj : covertObj === null || covertObj === void 0 ? void 0 : covertObj.name;
        const [{ covert = null } = {}] = this.coverts.filter(({ name: covertName }) => covertName === name);
        if (name && !covert) {
            console.info(`covert: ${name}没有被注册!!`);
        }
        const covertType = covert && new covert(builder.injector || this.injector);
        if (covertType) {
            covertType.covert = covertObj;
            covertType.builder = builder;
            covertType.builderField = builderField;
        }
        return covertType;
    }
};
Covert = __decorate([
    __param(0, Inject(Injector)),
    __param(1, Inject(COVERT_CONFIG)),
    __metadata("design:paramtypes", [Injector, Array])
], Covert);
export { Covert };

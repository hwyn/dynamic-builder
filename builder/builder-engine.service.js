"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderEngine = void 0;
const tslib_1 = require("tslib");
const di_1 = require("@fm/di");
const lodash_1 = require("lodash");
const token_1 = require("../token");
let BuilderEngine = class BuilderEngine {
    uiElement;
    constructor(uiComponents) {
        this.uiElement = (0, lodash_1.flatMap)(uiComponents);
    }
    getUiComponent(name) {
        const [{ component } = { component: null }] = this.uiElement.filter((ui) => ui.name === name);
        return component;
    }
};
BuilderEngine = tslib_1.__decorate([
    (0, di_1.Injectable)(),
    tslib_1.__param(0, (0, di_1.Inject)(token_1.UI_ELEMENT)),
    tslib_1.__metadata("design:paramtypes", [Array])
], BuilderEngine);
exports.BuilderEngine = BuilderEngine;

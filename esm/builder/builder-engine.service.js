import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@fm/di';
import { flatMap } from 'lodash';
import { UI_ELEMENT } from '../token';
let BuilderEngine = class BuilderEngine {
    constructor(uiComponents) {
        this.uiElement = flatMap(uiComponents);
    }
    getUiComponent(name) {
        const [{ component } = { component: null }] = this.uiElement.filter((ui) => ui.name === name);
        return component;
    }
};
BuilderEngine = __decorate([
    Injectable(),
    __param(0, Inject(UI_ELEMENT)),
    __metadata("design:paramtypes", [Array])
], BuilderEngine);
export { BuilderEngine };

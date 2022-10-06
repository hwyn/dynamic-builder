import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@fm/di';
import { flatMap } from 'lodash';
import { UI_ELEMENT } from '../token';
var BuilderEngine = /** @class */ (function () {
    function BuilderEngine(uiComponents) {
        this.uiElement = flatMap(uiComponents);
    }
    BuilderEngine.prototype.getUiComponent = function (name) {
        var _a = this.uiElement.filter(function (ui) { return ui.name === name; })[0], _b = _a === void 0 ? { component: null } : _a, component = _b.component;
        return component;
    };
    BuilderEngine = __decorate([
        Injectable(),
        __param(0, Inject(UI_ELEMENT)),
        __metadata("design:paramtypes", [Array])
    ], BuilderEngine);
    return BuilderEngine;
}());
export { BuilderEngine };

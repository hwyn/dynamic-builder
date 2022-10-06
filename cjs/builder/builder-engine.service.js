"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderEngine = void 0;
var tslib_1 = require("tslib");
var di_1 = require("@fm/di");
var lodash_1 = require("lodash");
var token_1 = require("../token");
var BuilderEngine = /** @class */ (function () {
    function BuilderEngine(uiComponents) {
        this.uiElement = (0, lodash_1.flatMap)(uiComponents);
    }
    BuilderEngine.prototype.getUiComponent = function (name) {
        var _a = this.uiElement.filter(function (ui) { return ui.name === name; })[0], _b = _a === void 0 ? { component: null } : _a, component = _b.component;
        return component;
    };
    BuilderEngine = tslib_1.__decorate([
        (0, di_1.Injectable)(),
        tslib_1.__param(0, (0, di_1.Inject)(token_1.UI_ELEMENT)),
        tslib_1.__metadata("design:paramtypes", [Array])
    ], BuilderEngine);
    return BuilderEngine;
}());
exports.BuilderEngine = BuilderEngine;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderEngine = void 0;
var lodash_1 = require("lodash");
var BuilderEngine = /** @class */ (function () {
    function BuilderEngine(uiComponents) {
        this.uiElement = (0, lodash_1.flatMap)(uiComponents);
    }
    BuilderEngine.prototype.getUiComponent = function (name) {
        var _a = this.uiElement.filter(function (ui) { return ui.name === name; })[0], _b = _a === void 0 ? { component: null } : _a, component = _b.component;
        return component;
    };
    return BuilderEngine;
}());
exports.BuilderEngine = BuilderEngine;

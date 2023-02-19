import { flatMap } from 'lodash';
var BuilderEngine = /** @class */ (function () {
    function BuilderEngine(uiComponents) {
        this.uiElement = flatMap(uiComponents);
    }
    BuilderEngine.prototype.getUiComponent = function (name) {
        var _a = this.uiElement.filter(function (ui) { return ui.name === name; })[0], _b = _a === void 0 ? { component: null } : _a, component = _b.component;
        return component;
    };
    return BuilderEngine;
}());
export { BuilderEngine };

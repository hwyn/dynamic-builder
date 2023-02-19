import { flatMap } from 'lodash';
export class BuilderEngine {
    constructor(uiComponents) {
        this.uiElement = flatMap(uiComponents);
    }
    getUiComponent(name) {
        const [{ component } = { component: null }] = this.uiElement.filter((ui) => ui.name === name);
        return component;
    }
}

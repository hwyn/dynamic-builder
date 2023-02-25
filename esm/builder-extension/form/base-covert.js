export class BaseCovert {
    constructor(injector) {
        this.injector = injector;
    }
    invoke(context) {
        return Object.assign(this, context);
    }
}

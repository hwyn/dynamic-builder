import { BaseType } from '../context/base-type';
export class BaseConvert extends BaseType {
    invoke(context) {
        return Object.assign(this, context);
    }
}

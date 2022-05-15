"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_JSON_CONFIG = exports.VALIDATOR_SERVICE = exports.BIND_BUILDER_ELEMENT = exports.BIND_FORM_CONTROL = exports.FACTORY_BUILDER = exports.LOAD_BUILDER_CONFIG = exports.BUILDER_EXTENSION = exports.ACTION_INTERCEPT = exports.ACTIONS_CONFIG = exports.UI_ELEMENT = void 0;
const di_1 = require("@fm/di");
exports.UI_ELEMENT = di_1.InjectorToken.get('UI_ELEMENT');
exports.ACTIONS_CONFIG = di_1.InjectorToken.get('ACTION_CONFIG');
exports.ACTION_INTERCEPT = di_1.InjectorToken.get('ACTION_INTERCEPT');
exports.BUILDER_EXTENSION = di_1.InjectorToken.get('BUILDER_EXTENSION');
exports.LOAD_BUILDER_CONFIG = di_1.InjectorToken.get('LOAD_BUILDER_CONFIG');
exports.FACTORY_BUILDER = di_1.InjectorToken.get('FACTORY_BUILDER');
exports.BIND_FORM_CONTROL = di_1.InjectorToken.get('BIND_FORM_CONTROL');
exports.BIND_BUILDER_ELEMENT = di_1.InjectorToken.get('BIND_BUILDER_ELEMENT');
exports.VALIDATOR_SERVICE = di_1.InjectorToken.get('VALIDATOR_SERVICE');
exports.GET_JSON_CONFIG = di_1.InjectorToken.get('GET_JSON_CONFIG');
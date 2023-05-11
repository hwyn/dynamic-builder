"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBuilderDecorator = exports.Visibility = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
Object.defineProperty(exports, "Visibility", { enumerable: true, get: function () { return consts_1.Visibility; } });
var decorator_1 = require("./decorator");
Object.defineProperty(exports, "makeBuilderDecorator", { enumerable: true, get: function () { return decorator_1.makeBuilderDecorator; } });
tslib_1.__exportStar(require("./type-api"), exports);

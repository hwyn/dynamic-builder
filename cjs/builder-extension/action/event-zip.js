"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventZip = void 0;
var EventZip = /** @class */ (function () {
    function EventZip(_e) {
        this._e = _e;
    }
    Object.defineProperty(EventZip.prototype, "event", {
        get: function () {
            return this._e;
        },
        enumerable: false,
        configurable: true
    });
    return EventZip;
}());
exports.EventZip = EventZip;

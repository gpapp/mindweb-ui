"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var File = (function () {
    function File() {
    }
    Object.defineProperty(File.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    return File;
}());
exports.default = File;
//# sourceMappingURL=File.js.map
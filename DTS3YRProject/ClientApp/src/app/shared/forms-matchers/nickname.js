"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicknameMatcher = void 0;
/** Error when invalid control is dirty, touched, or submitted. */
var NicknameMatcher = /** @class */ (function () {
    function NicknameMatcher() {
    }
    NicknameMatcher.prototype.isErrorState = function (control, form) {
        var isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    };
    return NicknameMatcher;
}());
exports.NicknameMatcher = NicknameMatcher;
//# sourceMappingURL=nickname.js.map
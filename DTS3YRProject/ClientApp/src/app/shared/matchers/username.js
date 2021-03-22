"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameMatcher = void 0;
/** Error when invalid control is dirty, touched, or submitted. */
var UsernameMatcher = /** @class */ (function () {
    function UsernameMatcher() {
    }
    UsernameMatcher.prototype.isErrorState = function (control, form) {
        var isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    };
    return UsernameMatcher;
}());
exports.UsernameMatcher = UsernameMatcher;
//# sourceMappingURL=nickname.js.map
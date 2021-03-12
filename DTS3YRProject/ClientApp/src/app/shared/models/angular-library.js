"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularLibraryModel = void 0;
var external_config_1 = require("./external-config");
var AngularLibraryModel = /** @class */ (function (_super) {
    __extends(AngularLibraryModel, _super);
    function AngularLibraryModel() {
        var _this = _super.call(this) || this;
        _this.NAME = 'Angular Library';
        return _this;
    }
    AngularLibraryModel.prototype.setTokens = function (tokens) {
        if (tokens) {
            this.videoSettings.setScreenSharing(this.videoSettings.hasScreenSharing() && (tokens === null || tokens === void 0 ? void 0 : tokens.length) > 1);
            _super.prototype.setTokens.call(this, tokens);
        }
    };
    AngularLibraryModel.prototype.getComponentName = function () {
        return this.NAME;
    };
    return AngularLibraryModel;
}(external_config_1.ExternalConfigModel));
exports.AngularLibraryModel = AngularLibraryModel;
//# sourceMappingURL=angular-library.js.map
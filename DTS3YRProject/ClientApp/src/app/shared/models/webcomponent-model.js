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
exports.WebComponentModel = void 0;
var external_config_1 = require("./external-config");
var WebComponentModel = /** @class */ (function (_super) {
    __extends(WebComponentModel, _super);
    function WebComponentModel() {
        var _this = _super.call(this) || this;
        _this.NAME = 'WebComponent';
        return _this;
    }
    WebComponentModel.prototype.setSessionConfig = function (config) {
        var _a;
        this.sessionConfig = config;
        if (!!this.sessionConfig) {
            this.sessionName = this.sessionConfig.sessionName;
            this.nickname = this.sessionConfig.user;
            this.tokens = this.sessionConfig.tokens;
            if (this.sessionConfig.videoSettings && this.isvideoSettingsType(this.sessionConfig.videoSettings)) {
                this.videoSettings.set(this.sessionConfig.videoSettings);
            }
            // Allow screen sharing only if two tokens are received
            this.videoSettings.setScreenSharing(this.videoSettings.hasScreenSharing() && ((_a = this.tokens) === null || _a === void 0 ? void 0 : _a.length) > 1);
            if (!this.videoSettings.hasScreenSharing()) {
                console.warn('ScreenSharing has been disabled. OpenVidu Angular has received only one token.');
            }
        }
    };
    WebComponentModel.prototype.getComponentName = function () {
        return this.NAME;
    };
    WebComponentModel.prototype.isvideoSettingsType = function (obj) {
        return ('chat' in obj &&
            typeof obj['chat'] === 'boolean' &&
            'autopublish' in obj &&
            typeof obj['autopublish'] === 'boolean' &&
            'toolbar' in obj &&
            typeof obj['toolbar'] === 'boolean' &&
            'footer' in obj &&
            typeof obj['footer'] === 'boolean' &&
            'toolbarButtons' in obj &&
            typeof obj['toolbarButtons'] === 'object' &&
            'audio' in obj.toolbarButtons &&
            typeof obj.toolbarButtons['audio'] === 'boolean' &&
            'audio' in obj.toolbarButtons &&
            typeof obj.toolbarButtons['audio'] === 'boolean' &&
            'video' in obj.toolbarButtons &&
            typeof obj.toolbarButtons['video'] === 'boolean' &&
            'screenShare' in obj.toolbarButtons &&
            typeof obj.toolbarButtons['screenShare'] === 'boolean' &&
            'fullscreen' in obj.toolbarButtons &&
            typeof obj.toolbarButtons['fullscreen'] === 'boolean' &&
            'layoutSpeaking' in obj.toolbarButtons &&
            typeof obj.toolbarButtons['layoutSpeaking'] === 'boolean' &&
            'exit' in obj.toolbarButtons &&
            typeof obj.toolbarButtons['exit'] === 'boolean');
    };
    return WebComponentModel;
}(external_config_1.ExternalConfigModel));
exports.WebComponentModel = WebComponentModel;
//# sourceMappingURL=webcomponent-model.js.map
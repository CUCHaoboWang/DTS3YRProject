"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalConfigModel = void 0;
var webcomponent_config_1 = require("../types/webcomponent-config");
var video_settings_1 = require("./video-settings");
var ExternalConfigModel = /** @class */ (function () {
    function ExternalConfigModel() {
        this.theme = webcomponent_config_1.Theme.DARK;
        this.videoSettings = new video_settings_1.VideoSettingsModel();
    }
    ExternalConfigModel.prototype.getComponentName = function () { };
    ExternalConfigModel.prototype.getVideoSettings = function () {
        return this.videoSettings;
    };
    ExternalConfigModel.prototype.getSessionName = function () {
        return this.sessionName;
    };
    ExternalConfigModel.prototype.getOvServerUrl = function () {
        return this.ovServerUrl;
    };
    ExternalConfigModel.prototype.getOvSecret = function () {
        return this.ovSecret;
    };
    ExternalConfigModel.prototype.getTheme = function () {
        return this.theme;
    };
    ExternalConfigModel.prototype.getNickname = function () {
        return this.nickname;
    };
    ExternalConfigModel.prototype.getTokens = function () {
        return this.tokens;
    };
    ExternalConfigModel.prototype.getScreenToken = function () {
        return this.tokens[1];
    };
    ExternalConfigModel.prototype.getWebcamToken = function () {
        return this.tokens[0];
    };
    ExternalConfigModel.prototype.setVideoSettings = function (videoSettings) {
        if (!!videoSettings) {
            this.videoSettings.set(videoSettings);
        }
    };
    ExternalConfigModel.prototype.setSessionName = function (sessionName) {
        this.sessionName = sessionName;
    };
    ExternalConfigModel.prototype.setOvServerUrl = function (url) {
        this.ovServerUrl = url;
    };
    ExternalConfigModel.prototype.setOvSecret = function (secret) {
        this.ovSecret = secret;
    };
    ExternalConfigModel.prototype.setTheme = function (theme) {
        if (Object.values(webcomponent_config_1.Theme).includes(theme)) {
            this.theme = theme === webcomponent_config_1.Theme.DARK ? webcomponent_config_1.Theme.DARK : webcomponent_config_1.Theme.LIGHT;
        }
    };
    ExternalConfigModel.prototype.setNickname = function (nickname) {
        this.nickname = nickname;
    };
    ExternalConfigModel.prototype.setTokens = function (tokens) {
        this.tokens = tokens;
    };
    ExternalConfigModel.prototype.canJoinToSession = function () {
        return this.canOVCallGenerateToken() || this.hasReceivedToken();
    };
    ExternalConfigModel.prototype.hasTokens = function () {
        var _a;
        return ((_a = this.tokens) === null || _a === void 0 ? void 0 : _a.length) > 0;
    };
    ExternalConfigModel.prototype.canOVCallGenerateToken = function () {
        return !!this.sessionName && !!this.ovServerUrl && !!this.ovSecret && !!this.nickname;
    };
    ExternalConfigModel.prototype.hasReceivedToken = function () {
        return !!this.tokens && this.tokens.length > 0 && !!this.nickname;
    };
    return ExternalConfigModel;
}());
exports.ExternalConfigModel = ExternalConfigModel;
//# sourceMappingURL=external-config.js.map
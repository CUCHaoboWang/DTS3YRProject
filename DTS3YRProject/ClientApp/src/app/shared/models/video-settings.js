"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSettingsModel = void 0;
var VideoSettingsModel = /** @class */ (function () {
    function VideoSettingsModel() {
        this.videoSettings = {
            chat: true,
            autopublish: false,
            toolbar: true,
            footer: true,
            toolbarButtons: {
                video: true,
                audio: true,
                fullscreen: true,
                screenShare: true,
                layoutSpeaking: true,
                exit: true
            }
        };
    }
    VideoSettingsModel.prototype.set = function (videoSettings) {
        this.videoSettings = videoSettings;
    };
    VideoSettingsModel.prototype.isAutoPublish = function () {
        return this.videoSettings.autopublish;
    };
    VideoSettingsModel.prototype.hasVideo = function () {
        return this.videoSettings.toolbarButtons.video;
    };
    VideoSettingsModel.prototype.hasScreenSharing = function () {
        return this.videoSettings.toolbarButtons.screenShare;
    };
    VideoSettingsModel.prototype.hasLayoutSpeaking = function () {
        return this.videoSettings.toolbarButtons.layoutSpeaking;
    };
    VideoSettingsModel.prototype.hasFullscreen = function () {
        return this.videoSettings.toolbarButtons.fullscreen;
    };
    VideoSettingsModel.prototype.hasAudio = function () {
        return this.videoSettings.toolbarButtons.audio;
    };
    VideoSettingsModel.prototype.hasChat = function () {
        return this.videoSettings.chat;
    };
    VideoSettingsModel.prototype.hasExit = function () {
        return this.videoSettings.toolbarButtons.exit;
    };
    VideoSettingsModel.prototype.setScreenSharing = function (screenShare) {
        this.videoSettings.toolbarButtons.screenShare = screenShare;
    };
    VideoSettingsModel.prototype.hasFooter = function () {
        return this.videoSettings.footer;
    };
    VideoSettingsModel.prototype.hasToolbar = function () {
        return this.videoSettings.toolbar;
    };
    return VideoSettingsModel;
}());
exports.VideoSettingsModel = VideoSettingsModel;
//# sourceMappingURL=video-settings.js.map
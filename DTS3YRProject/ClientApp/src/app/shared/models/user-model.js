"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var video_type_1 = require("../types/video-type");
/**
 * Packs all the information about the user
 */
var UserModel = /** @class */ (function () {
    /**
     * @hidden
     */
    function UserModel(connectionId, streamManager, nickname) {
        this.connectionId = connectionId || '';
        this.nickname = nickname || 'User';
        this.streamManager = streamManager || null;
    }
    /**
     * Return `true` if audio track is active and `false` if audio track is muted
     */
    UserModel.prototype.isAudioActive = function () {
        var _a, _b;
        // console.log("isAudioActive");
        return (_b = (_a = this.streamManager) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.audioActive;
    };
    /**
     * Return `true` if video track is active and `false` if video track is muted
     */
    UserModel.prototype.isVideoActive = function () {
        var _a, _b;
        // console.log("isVideoActive");
        return (_b = (_a = this.streamManager) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.videoActive;
    };
    /**
     * Return the connection ID
     */
    UserModel.prototype.getConnectionId = function () {
        var _a, _b, _c;
        return ((_c = (_b = (_a = this.streamManager) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.connectionId) || this.connectionId;
    };
    /**
     * Return the user nickname
     */
    UserModel.prototype.getNickname = function () {
        return this.nickname;
    };
    /**
     * Return the [[streamManger]] object
     */
    UserModel.prototype.getStreamManager = function () {
        return this.streamManager;
    };
    /**
     * Return the user avatar
     */
    UserModel.prototype.getAvatar = function () {
        return this.avatar;
    };
    UserModel.prototype.setAvatar = function (avatar) {
        this.avatar = avatar;
    };
    /**
     * Return `true` if user has a local role and `false` if not
     */
    UserModel.prototype.isLocal = function () {
        return this.local;
    };
    /**
     * Return `true` if user has a remote role and `false` if not
     */
    UserModel.prototype.isRemote = function () {
        var _a;
        return (_a = this.streamManager) === null || _a === void 0 ? void 0 : _a.remote;
    };
    /**
     * Return `true` if user has a screen role and `false` if not
     */
    UserModel.prototype.isScreen = function () {
        var _a, _b;
        // console.log("isScreen");
        return ((_b = (_a = this.streamManager) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.typeOfVideo) === video_type_1.VideoType.SCREEN;
    };
    /**
     * Return `true` if user has a camera role and `false` if not
     */
    UserModel.prototype.isCamera = function () {
        var _a, _b;
        // console.log("CCC");
        return ((_b = (_a = this.streamManager) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.typeOfVideo) === video_type_1.VideoType.CAMERA || (this.isLocal() && !this.isScreen());
    };
    /**
     * Set the streamManager value object
     * @param streamManager value of streamManager
     */
    UserModel.prototype.setStreamManager = function (streamManager) {
        this.streamManager = streamManager;
    };
    /**
     * Set the user nickname value
     * @param nickname value of user nickname
     */
    UserModel.prototype.setNickname = function (nickname) {
        this.nickname = nickname;
    };
    UserModel.prototype.isVideoSizeBig = function () {
        return this.videoSizeBig;
    };
    /**
     * @hidden
     */
    UserModel.prototype.setVideoSizeBig = function (big) {
        this.videoSizeBig = big;
    };
    /**
     * @hidden
     */
    // Used when the streamManager is null (users without devices)
    UserModel.prototype.setLocal = function (local) {
        this.local = local;
    };
    return UserModel;
}());
exports.UserModel = UserModel;
//# sourceMappingURL=user-model.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalUsersService = void 0;
var core_1 = require("@angular/core");
var user_model_1 = require("../../models/user-model");
var logger_service_1 = require("../logger/logger.service");
var BehaviorSubject_1 = require("rxjs/internal/BehaviorSubject");
var LocalUsersService = /** @class */ (function () {
    function LocalUsersService(loggerSrv) {
        this.loggerSrv = loggerSrv;
        this._Users = new BehaviorSubject_1.BehaviorSubject([]);
        this._screenShareState = new BehaviorSubject_1.BehaviorSubject(false);
        this._webcamVideoActive = new BehaviorSubject_1.BehaviorSubject(true);
        this.webcamUser = null;
        this.screenUser = null;
        this.log = this.loggerSrv.get('LocalUsersService');
    }
    LocalUsersService.prototype.initialize = function () {
        this.Users = this._Users.asObservable();
        this.screenShareState = this._screenShareState.asObservable();
        this.webcamVideoActive = this._webcamVideoActive.asObservable();
        this.webcamUser = new user_model_1.UserModel();
        // Used when the streamManager is null (users without devices)
        this.webcamUser.setLocal(true);
        this._Users.next([this.webcamUser]);
    };
    LocalUsersService.prototype.getWebcamPublisher = function () {
        var _a;
        return (_a = this.webcamUser) === null || _a === void 0 ? void 0 : _a.getStreamManager();
    };
    LocalUsersService.prototype.setWebcamPublisher = function (publisher) {
        this.webcamUser.setStreamManager(publisher);
    };
    LocalUsersService.prototype.getScreenPublisher = function () {
        var _a;
        return (_a = this.screenUser) === null || _a === void 0 ? void 0 : _a.getStreamManager();
    };
    LocalUsersService.prototype.setScreenPublisher = function (publisher) {
        this.screenUser.setStreamManager(publisher);
    };
    LocalUsersService.prototype.enableWebcamUser = function () {
        this._Users.next([this.webcamUser, this.screenUser]);
    };
    LocalUsersService.prototype.disableWebcamUser = function () {
        this._Users.next([this.screenUser]);
    };
    LocalUsersService.prototype.enableScreenUser = function (screenPublisher) {
        var _a, _b;
        this.log.d('Enabling screen publisher');
        var connectionId = (_b = (_a = screenPublisher === null || screenPublisher === void 0 ? void 0 : screenPublisher.session) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.connectionId;
        this.screenUser = new user_model_1.UserModel(connectionId, screenPublisher, this.getScreenUserName());
        this.screenUser.setAvatar(this.webcamUser.getAvatar());
        this._screenShareState.next(true);
        if (this.isWebCamEnabled()) {
            this._Users.next([this.webcamUser, this.screenUser]);
            return;
        }
        this._Users.next([this.screenUser]);
    };
    LocalUsersService.prototype.disableScreenUser = function () {
        this._Users.next([this.webcamUser]);
        this._screenShareState.next(false);
    };
    LocalUsersService.prototype.updateUsersStatus = function () {
        this._webcamVideoActive.next(this.webcamUser.isVideoActive());
    };
    LocalUsersService.prototype.clear = function () {
        this.screenUser = null;
        this.webcamUser = new user_model_1.UserModel();
        this._Users.next([this.webcamUser]);
    };
    LocalUsersService.prototype.isWebCamEnabled = function () {
        return this._Users.getValue()[0].isCamera();
    };
    LocalUsersService.prototype.isOnlyScreenConnected = function () {
        return this._Users.getValue()[0].isScreen();
    };
    LocalUsersService.prototype.hasWebcamVideoActive = function () {
        return this.webcamUser.isVideoActive();
    };
    LocalUsersService.prototype.hasWebcamAudioActive = function () {
        var _a;
        return (_a = this.webcamUser) === null || _a === void 0 ? void 0 : _a.isAudioActive();
    };
    LocalUsersService.prototype.hasScreenAudioActive = function () {
        var _a;
        return (_a = this.screenUser) === null || _a === void 0 ? void 0 : _a.isAudioActive();
    };
    LocalUsersService.prototype.areBothConnected = function () {
        return this._Users.getValue().length === 2;
    };
    LocalUsersService.prototype.isOnlyWebcamConnected = function () {
        return this.isWebCamEnabled() && !this.areBothConnected();
    };
    LocalUsersService.prototype.isScreenShareEnabled = function () {
        return this.areBothConnected() || this.isOnlyScreenConnected();
    };
    LocalUsersService.prototype.setAvatar = function (avatar) {
        var _a, _b;
        (_a = this.webcamUser) === null || _a === void 0 ? void 0 : _a.setAvatar(avatar);
        (_b = this.screenUser) === null || _b === void 0 ? void 0 : _b.setAvatar(avatar);
    };
    LocalUsersService.prototype.updateUsersNickname = function (nickname) {
        var _a;
        this.webcamUser.setNickname(nickname);
        (_a = this.screenUser) === null || _a === void 0 ? void 0 : _a.setNickname(this.getScreenUserName());
    };
    LocalUsersService.prototype.getAvatar = function () {
        return this.webcamUser.getAvatar();
    };
    LocalUsersService.prototype.getWebcamUserName = function () {
        return this.webcamUser.getNickname();
    };
    LocalUsersService.prototype.getScreenUserName = function () {
        return this.getWebcamUserName() + '_SCREEN';
    };
    LocalUsersService.prototype.resetUsersZoom = function () {
        var _a, _b;
        (_a = this.webcamUser) === null || _a === void 0 ? void 0 : _a.setVideoSizeBig(false);
        (_b = this.screenUser) === null || _b === void 0 ? void 0 : _b.setVideoSizeBig(false);
    };
    LocalUsersService.prototype.toggleZoom = function (connectionId) {
        if (this.webcamUser.getConnectionId() === connectionId) {
            this.webcamUser.setVideoSizeBig(!this.webcamUser.isVideoSizeBig());
            return;
        }
        this.screenUser.setVideoSizeBig(!this.screenUser.isVideoSizeBig());
    };
    LocalUsersService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [logger_service_1.LoggerService])
    ], LocalUsersService);
    return LocalUsersService;
}());
exports.LocalUsersService = LocalUsersService;
//# sourceMappingURL=local-users.service.js.map
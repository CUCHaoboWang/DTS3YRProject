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
exports.AvatarService = void 0;
var core_1 = require("@angular/core");
var local_users_service_1 = require("../local-users/local-users.service");
var chat_type_1 = require("../../types/chat-type");
var logger_service_1 = require("../logger/logger.service");
var AvatarService = /** @class */ (function () {
    function AvatarService(localUsersService, loggerSrv) {
        this.localUsersService = localUsersService;
        this.loggerSrv = loggerSrv;
        this.videoAvatar = 'assets/images/favicon.png';
        this.capturedAvatar = '';
        this.log = this.loggerSrv.get('ChatService');
    }
    AvatarService.prototype.setCaputedAvatar = function (avatar) {
        this.capturedAvatar = avatar;
    };
    AvatarService.prototype.setFinalAvatar = function (type) {
        if (type === chat_type_1.AvatarType.CAPTURED) {
            this.localUsersService.setAvatar(this.capturedAvatar);
            return;
        }
        this.localUsersService.setAvatar(this.videoAvatar);
    };
    AvatarService.prototype.getVideoAvatar = function () {
        return this.videoAvatar;
    };
    AvatarService.prototype.getCapturedAvatar = function () {
        return this.capturedAvatar;
    };
    AvatarService.prototype.createCapture = function () {
        this.log.d('Capturing avatar ...');
        var avatar = document.createElement('canvas');
        var video = this.localUsersService.getWebcamPublisher().videos[0].video;
        avatar.className = 'user-img';
        avatar.width = 100;
        avatar.height = 100;
        if (!!video) {
            var avatarContext = avatar.getContext('2d');
            avatarContext.drawImage(video, 200, 120, 285, 285, 0, 0, 100, 100);
            this.capturedAvatar = avatar.toDataURL();
        }
        return this.capturedAvatar;
    };
    AvatarService.prototype.getAvatarFromConnectionData = function (data) {
        var avatar;
        try {
            avatar = JSON.parse(data).avatar;
        }
        catch (error) {
            avatar = this.getVideoAvatar();
        }
        return avatar;
    };
    AvatarService.prototype.clear = function () {
        this.capturedAvatar = '';
    };
    AvatarService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [local_users_service_1.LocalUsersService, logger_service_1.LoggerService])
    ], AvatarService);
    return AvatarService;
}());
exports.AvatarService = AvatarService;
//# sourceMappingURL=avatar.service.js.map
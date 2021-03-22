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
exports.RemoteUsersService = void 0;
var core_1 = require("@angular/core");
var user_model_1 = require("../../models/user-model");
var logger_service_1 = require("../logger/logger.service");
var utils_service_1 = require("../utils/utils.service");
var BehaviorSubject_1 = require("rxjs/internal/BehaviorSubject");
var avatar_service_1 = require("../avatar/avatar.service");
var RemoteUsersService = /** @class */ (function () {
    function RemoteUsersService(loggerSrv, utilsSrv, avatarService) {
        this.loggerSrv = loggerSrv;
        this.utilsSrv = utilsSrv;
        this.avatarService = avatarService;
        this._remoteUsers = new BehaviorSubject_1.BehaviorSubject([]);
        this._remoteUserNameList = new BehaviorSubject_1.BehaviorSubject([]);
        this.users = [];
        this.log = this.loggerSrv.get('RemoteService');
        this.remoteUsers = this._remoteUsers.asObservable();
        this.remoteUserNameList = this._remoteUserNameList.asObservable();
    }
    RemoteUsersService.prototype.updateUsers = function () {
        this._remoteUsers.next(this.users);
    };
    RemoteUsersService.prototype.add = function (event, subscriber) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var nickname = '';
        var avatar = '';
        var connectionId = ((_c = (_b = (_a = event) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.connectionId) || ((_e = (_d = event) === null || _d === void 0 ? void 0 : _d.connection) === null || _e === void 0 ? void 0 : _e.connectionId);
        var data = ((_h = (_g = (_f = event) === null || _f === void 0 ? void 0 : _f.stream) === null || _g === void 0 ? void 0 : _g.connection) === null || _h === void 0 ? void 0 : _h.data) || ((_k = (_j = event) === null || _j === void 0 ? void 0 : _j.connection) === null || _k === void 0 ? void 0 : _k.data);
        nickname = this.utilsSrv.getNicknameFromConnectionData(data);
        avatar = this.avatarService.getAvatarFromConnectionData(data);
        var newUser = new user_model_1.UserModel(connectionId, subscriber, nickname);
        newUser.setAvatar(avatar);
        // Add new user (connectionCreated Event) or assign the streamManager to old user when the connnectionId exists (streamCreated Event)
        this.addUser(newUser);
        this.updateUsers();
    };
    RemoteUsersService.prototype.removeUserByConnectionId = function (connectionId) {
        this.log.w('Deleting user: ', connectionId);
        var user = this.getRemoteUserByConnectionId(connectionId);
        var index = this.users.indexOf(user, 0);
        if (index > -1) {
            this.users.splice(index, 1);
            this.updateUsers();
        }
    };
    RemoteUsersService.prototype.someoneIsSharingScreen = function () {
        return this.users.some(function (user) { return user.isScreen(); });
    };
    RemoteUsersService.prototype.toggleUserZoom = function (connectionId) {
        var user = this.getRemoteUserByConnectionId(connectionId);
        user.setVideoSizeBig(!user.isVideoSizeBig());
    };
    RemoteUsersService.prototype.resetUsersZoom = function () {
        this.users.forEach(function (u) { return u.setVideoSizeBig(false); });
    };
    RemoteUsersService.prototype.setUserZoom = function (connectionId, zoom) {
        var _a;
        (_a = this.getRemoteUserByConnectionId(connectionId)) === null || _a === void 0 ? void 0 : _a.setVideoSizeBig(zoom);
    };
    RemoteUsersService.prototype.getRemoteUserByConnectionId = function (connectionId) {
        return this.users.find(function (u) { return u.getConnectionId() === connectionId; });
    };
    RemoteUsersService.prototype.updateNickname = function (connectionId, nickname) {
        var user = this.getRemoteUserByConnectionId(connectionId);
        user === null || user === void 0 ? void 0 : user.setNickname(nickname);
        this._remoteUsers.next(this.users);
        // Update nickname in remote nickname list
        var remoteUserNameList = this._remoteUserNameList.getValue();
        remoteUserNameList.forEach(function (element) {
            if (element.connectionId === connectionId) {
                element.nickname = nickname;
                return;
            }
        });
        this._remoteUserNameList.next(remoteUserNameList);
    };
    RemoteUsersService.prototype.clear = function () {
        this._remoteUsers = new BehaviorSubject_1.BehaviorSubject([]);
        this.remoteUsers = this._remoteUsers.asObservable();
        this._remoteUserNameList = new BehaviorSubject_1.BehaviorSubject([]);
        this.remoteUserNameList = this._remoteUserNameList.asObservable();
        this.users = [];
    };
    RemoteUsersService.prototype.getUserAvatar = function (connectionId) {
        var _a;
        return ((_a = this.getRemoteUserByConnectionId(connectionId)) === null || _a === void 0 ? void 0 : _a.getAvatar()) || this.avatarService.getVideoAvatar();
    };
    RemoteUsersService.prototype.addUserName = function (event) {
        var nickname = this.utilsSrv.getNicknameFromConnectionData(event.connection.data);
        var connectionId = event.connection.connectionId;
        var newUserNameList = this._remoteUserNameList.getValue();
        newUserNameList.push({ nickname: nickname, connectionId: connectionId });
        this._remoteUserNameList.next(newUserNameList);
    };
    RemoteUsersService.prototype.deleteUserName = function (event) {
        var oldUserNameList = this._remoteUserNameList.getValue();
        var newUserNameList = oldUserNameList.filter(function (element) { return element.connectionId !== event.connection.connectionId; });
        this._remoteUserNameList.next(newUserNameList);
    };
    RemoteUsersService.prototype.addUser = function (user) {
        var oldUser = this.getRemoteUserByConnectionId(user.connectionId);
        // Assign streamManager if user exists due to connectionCreated Event
        if (!!oldUser) {
            oldUser.setStreamManager(user.getStreamManager());
            return;
        }
        this.users.push(user);
    };
    RemoteUsersService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [logger_service_1.LoggerService, utils_service_1.UtilsService, avatar_service_1.AvatarService])
    ], RemoteUsersService);
    return RemoteUsersService;
}());
exports.RemoteUsersService = RemoteUsersService;
//# sourceMappingURL=remote-users.service.js.map
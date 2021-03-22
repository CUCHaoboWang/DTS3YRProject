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
exports.ChatService = void 0;
var core_1 = require("@angular/core");
var remote_users_service_1 = require("../remote-users/remote-users.service");
var logger_service_1 = require("../logger/logger.service");
var notifications_service_1 = require("../notifications/notifications.service");
var webrtc_service_1 = require("../webrtc/webrtc.service");
var local_users_service_1 = require("../local-users/local-users.service");
var BehaviorSubject_1 = require("rxjs/internal/BehaviorSubject");
var ChatService = /** @class */ (function () {
    function ChatService(loggerSrv, webRTCService, localUsersService, remoteUsersService, notificationsService) {
        this.loggerSrv = loggerSrv;
        this.webRTCService = webRTCService;
        this.localUsersService = localUsersService;
        this.remoteUsersService = remoteUsersService;
        this.notificationsService = notificationsService;
        this._messageList = new BehaviorSubject_1.BehaviorSubject([]);
        this._toggleChat = new BehaviorSubject_1.BehaviorSubject(false);
        this.messageList = [];
        this.messagesUnread = 0;
        this._messagesUnread = new BehaviorSubject_1.BehaviorSubject(0);
        this.log = this.loggerSrv.get('ChatService');
        this.messagesObs = this._messageList.asObservable();
        this.toggleChatObs = this._toggleChat.asObservable();
        this.messagesUnreadObs = this._messagesUnread.asObservable();
    }
    ChatService.prototype.setChatComponent = function (chatSidenav) {
        this.chatComponent = chatSidenav;
    };
    ChatService.prototype.subscribeToChat = function () {
        var _this = this;
        var session = this.webRTCService.getWebcamSession();
        session.on('signal:chat', function (event) {
            var connectionId = event.from.connectionId;
            var data = JSON.parse(event.data);
            var isMyOwnConnection = _this.webRTCService.isMyOwnConnection(connectionId);
            _this.messageList.push({
                isLocal: isMyOwnConnection,
                nickname: data.nickname,
                message: data.message,
                userAvatar: isMyOwnConnection
                    ? _this.localUsersService.getAvatar()
                    : _this.remoteUsersService.getUserAvatar(connectionId)
            });
            if (!_this.isChatOpened()) {
                _this.addMessageUnread();
                _this.notificationsService.newMessage(data.nickname.toUpperCase(), _this.toggleChat.bind(_this));
            }
            _this._messageList.next(_this.messageList);
        });
    };
    ChatService.prototype.sendMessage = function (message) {
        message = message.replace(/ +(?= )/g, '');
        if (message !== '' && message !== ' ') {
            var data = {
                message: message,
                nickname: this.localUsersService.getWebcamUserName()
            };
            var sessionAvailable = this.webRTCService.getSessionOfUserConnected();
            sessionAvailable.signal({
                data: JSON.stringify(data),
                type: 'chat'
            });
        }
    };
    ChatService.prototype.toggleChat = function () {
        var _this = this;
        this.log.d('Toggling chat');
        this.chatComponent.toggle().then(function () {
            _this.chatOpened = _this.chatComponent.opened;
            _this._toggleChat.next(_this.chatOpened);
            if (_this.chatOpened) {
                _this.messagesUnread = 0;
                _this._messagesUnread.next(_this.messagesUnread);
            }
        });
    };
    ChatService.prototype.isChatOpened = function () {
        return this.chatOpened;
    };
    ChatService.prototype.addMessageUnread = function () {
        this.messagesUnread++;
        this._messagesUnread.next(this.messagesUnread);
    };
    ChatService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [logger_service_1.LoggerService,
            webrtc_service_1.WebrtcService,
            local_users_service_1.LocalUsersService,
            remote_users_service_1.RemoteUsersService,
            notifications_service_1.NotificationsService])
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map
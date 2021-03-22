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
exports.ChatComponent = void 0;
var core_1 = require("@angular/core");
var chat_service_1 = require("../../services/chat/chat.service");
var ChatComponent = /** @class */ (function () {
    function ChatComponent(chatService) {
        this.chatService = chatService;
        this.messageList = [];
    }
    ChatComponent.prototype.onKeydownHandler = function (event) {
        console.log(event);
        if (this.chatOpened) {
            this.close();
        }
    };
    ChatComponent.prototype.ngOnInit = function () {
        this.subscribeToMessages();
        this.subscribeToToggleChat();
    };
    ChatComponent.prototype.ngOnDestroy = function () {
        if (this.chatMessageSubscription) {
            this.chatMessageSubscription.unsubscribe();
        }
        if (this.chatToggleSubscription) {
            this.chatToggleSubscription.unsubscribe();
        }
    };
    ChatComponent.prototype.eventKeyPress = function (event) {
        // Pressed 'Enter' key
        if (event && event.keyCode === 13) {
            this.sendMessage();
        }
    };
    ChatComponent.prototype.sendMessage = function () {
        this.chatService.sendMessage(this.message);
        this.message = '';
    };
    ChatComponent.prototype.scrollToBottom = function () {
        var _this = this;
        setTimeout(function () {
            try {
                _this.chatScroll.nativeElement.scrollTop = _this.chatScroll.nativeElement.scrollHeight;
            }
            catch (err) { }
        }, 20);
    };
    ChatComponent.prototype.close = function () {
        this.chatService.toggleChat();
    };
    ChatComponent.prototype.subscribeToMessages = function () {
        var _this = this;
        this.chatMessageSubscription = this.chatService.messagesObs.subscribe(function (messages) {
            _this.messageList = messages;
            _this.scrollToBottom();
        });
    };
    ChatComponent.prototype.subscribeToToggleChat = function () {
        var _this = this;
        this.chatToggleSubscription = this.chatService.toggleChatObs.subscribe(function (opened) {
            _this.chatOpened = opened;
            if (_this.chatOpened) {
                _this.scrollToBottom();
                setTimeout(function () {
                    _this.chatInput.nativeElement.focus();
                });
            }
        });
    };
    __decorate([
        core_1.ViewChild('chatScroll'),
        __metadata("design:type", core_1.ElementRef)
    ], ChatComponent.prototype, "chatScroll", void 0);
    __decorate([
        core_1.ViewChild('chatInput'),
        __metadata("design:type", core_1.ElementRef)
    ], ChatComponent.prototype, "chatInput", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ChatComponent.prototype, "lightTheme", void 0);
    __decorate([
        core_1.HostListener('document:keydown.escape', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], ChatComponent.prototype, "onKeydownHandler", null);
    ChatComponent = __decorate([
        core_1.Component({
            selector: 'chat-component',
            templateUrl: './chat.component.html',
            styleUrls: ['./chat.component.css']
        }),
        __metadata("design:paramtypes", [chat_service_1.ChatService])
    ], ChatComponent);
    return ChatComponent;
}());
exports.ChatComponent = ChatComponent;
//# sourceMappingURL=chat.component.js.map
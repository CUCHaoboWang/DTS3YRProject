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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallComponent = void 0;
var core_1 = require("@angular/core");
var Subscription_1 = require("rxjs/internal/Subscription");
var router_1 = require("@angular/router");
var logger_service_1 = require("../shared/services/logger/logger.service");
var signalr_service_1 = require("../shared/services/webrtc-signalr/signalr.service");
var webrtc_signalr_service_1 = require("../shared/services/webrtc-signalr/webrtc-signalr.service");
var VideoCallComponent = /** @class */ (function () {
    function VideoCallComponent(router, route, loggerSrv, signalRService, webRTCService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.loggerSrv = loggerSrv;
        this.signalRService = signalRService;
        this.webRTCService = webRTCService;
        this.subscriptions = new Subscription_1.Subscription();
        this.mediaError = function () { _this.log.d("Unable to access media devices."); };
        this.log = this.loggerSrv.get('VideoCallComponent');
    }
    VideoCallComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.myNickName = params.userName;
            _this.mySessionId = params.roomName;
        });
        this.messages = new Array();
        this.subscriptions.add(this.signalRService.newPeer$.subscribe(function (user) {
            _this.webRTCService.userJoined(user);
            _this.signalRService.sendNotificationToUser(_this.myNickName, user.connectionId);
        }));
        this.subscriptions.add(this.signalRService.notification$.subscribe(function (user) {
            _this.webRTCService.userJoined(user);
        }));
        this.subscriptions.add(this.signalRService.disconnectedPeer$.subscribe(function (user) {
            _this.webRTCService.userDisconnected(user);
        }));
        this.subscriptions.add(this.signalRService.signal$.subscribe(function (signalData) {
            _this.webRTCService.signalPeer(signalData.user, signalData.signal, _this.localStream);
        }));
        this.subscriptions.add(this.webRTCService.onSignalToSend$.subscribe(function (data) {
            _this.signalRService.sendSignalToUser(data.data, data.id);
        }));
        this.subscriptions.add(this.webRTCService.onData$.subscribe(function (peerData) {
            _this.messages = __spreadArrays(_this.messages, [{ own: false, message: peerData.data }]);
            _this.log.d("Data from user " + peerData.id + ": " + peerData.data);
        }));
        this.subscriptions.add(this.webRTCService.onStream$.subscribe(function (peerData) {
            _this.remoteVideo = peerData.id;
            _this.remoteStream = peerData.data;
            _this.videoPlayerRemote.nativeElement.srcObject = _this.remoteStream;
            _this.videoPlayerRemote.nativeElement.load();
            _this.videoPlayerRemote.nativeElement.play();
        }));
        this.initLocalUser();
    };
    VideoCallComponent.prototype.initLocalUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.signalRService.startConnection(this.myNickName, this.mySessionId)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                    case 2:
                        _a.localStream = _b.sent();
                        this.videoPlayerLocal.nativeElement.srcObject = this.localStream;
                        this.videoPlayerLocal.nativeElement.load();
                        this.videoPlayerLocal.nativeElement.play();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        this.log.w("Unable to access media devices. Error " + error_1 + ".");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VideoCallComponent.prototype.initRemoteUser = function (userInfo) {
        var peer = this.webRTCService.createPeer(this.localStream, userInfo.connectionId, true);
        this.webRTCService.currentPeer = peer;
    };
    VideoCallComponent.prototype.stopStreamedVideo = function () {
        var stream = this.localStream;
        var tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        this.videoPlayerLocal.nativeElement.srcObject = null;
    };
    VideoCallComponent.prototype.leaveSession = function () {
        this.log.d('Leaving session...');
        this.stopStreamedVideo();
        this.subscriptions.unsubscribe();
        this.router.navigate(['']);
    };
    VideoCallComponent.prototype.sendMessage = function () {
        this.webRTCService.sendMessage(this.messageString);
        this.messages = __spreadArrays(this.messages, [{ own: true, message: this.messageString }]);
        this.messageString = null;
    };
    VideoCallComponent.prototype.beforeunloadHandler = function () {
        this.leaveSession();
    };
    VideoCallComponent.prototype.ngOnDestroy = function () {
        this.leaveSession();
    };
    __decorate([
        core_1.ViewChild('videoPlayerLocal'),
        __metadata("design:type", core_1.ElementRef)
    ], VideoCallComponent.prototype, "videoPlayerLocal", void 0);
    __decorate([
        core_1.ViewChild('videoPlayerRemote'),
        __metadata("design:type", core_1.ElementRef)
    ], VideoCallComponent.prototype, "videoPlayerRemote", void 0);
    __decorate([
        core_1.HostListener('window:beforeunload'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], VideoCallComponent.prototype, "beforeunloadHandler", null);
    VideoCallComponent = __decorate([
        core_1.Component({
            selector: 'app-video-call',
            templateUrl: './video-call.component.html',
            styleUrls: ['./video-call.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_1.ActivatedRoute,
            logger_service_1.LoggerService,
            signalr_service_1.SignalRService,
            webrtc_signalr_service_1.WebrtcSignalRService])
    ], VideoCallComponent);
    return VideoCallComponent;
}());
exports.VideoCallComponent = VideoCallComponent;
//# sourceMappingURL=video-call.component.js.map
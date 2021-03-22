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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebrtcSignalRService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var WebrtcSignalRService = /** @class */ (function () {
    function WebrtcSignalRService() {
        this.onSignalToSend = new rxjs_1.Subject();
        this.onSignalToSend$ = this.onSignalToSend.asObservable();
        this.onStream = new rxjs_1.Subject();
        this.onStream$ = this.onStream.asObservable();
        this.onConnect = new rxjs_1.Subject();
        this.onConnect$ = this.onConnect.asObservable();
        this.onData = new rxjs_1.Subject();
        this.onData$ = this.onData.asObservable();
        this.users = new rxjs_1.BehaviorSubject([]);
        this.users$ = this.users.asObservable();
    }
    // ADD THE USER TO THE LIST
    WebrtcSignalRService.prototype.userJoined = function (user) {
        this.users.next(__spreadArrays(this.users.getValue(), [user]));
    };
    // REMOVE THE USER FROM THE LIST
    WebrtcSignalRService.prototype.userDisconnected = function (user) {
        var filteredUsers = this.users.getValue().filter(function (x) { return x.connectionId === user.connectionId; });
        this.users.next(filteredUsers);
    };
    WebrtcSignalRService.prototype.createPeer = function (stream, userId, initiator) {
        var _this = this;
        var peer = new SimplePeer({ initiator: initiator, stream: stream });
        peer.on('signal', function (data) {
            var stringData = JSON.stringify(data);
            _this.onSignalToSend.next({ id: userId, data: stringData });
        });
        peer.on('stream', function (data) {
            console.log('on stream', data);
            _this.onStream.next({ id: userId, data: data });
        });
        peer.on('connect', function () {
            _this.onConnect.next({ id: userId, data: null });
        });
        peer.on('data', function (data) {
            _this.onData.next({ id: userId, data: data });
        });
        return peer;
    };
    WebrtcSignalRService.prototype.signalPeer = function (userId, signal, stream) {
        var signalObject = JSON.parse(signal);
        if (this.currentPeer) {
            this.currentPeer.signal(signalObject);
        }
        else {
            this.currentPeer = this.createPeer(stream, userId, false);
            this.currentPeer.signal(signalObject);
        }
    };
    WebrtcSignalRService.prototype.sendMessage = function (message) {
        this.currentPeer.send(message);
    };
    WebrtcSignalRService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], WebrtcSignalRService);
    return WebrtcSignalRService;
}());
exports.WebrtcSignalRService = WebrtcSignalRService;
//# sourceMappingURL=webrtc-signalr.service.js.map
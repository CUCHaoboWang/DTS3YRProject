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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalRService = void 0;
var core_1 = require("@angular/core");
var signalR = require("@aspnet/signalr");
var rxjs_1 = require("rxjs");
var SignalRService = /** @class */ (function () {
    function SignalRService(baseUrl) {
        this.baseUrl = baseUrl;
        // Every Subject is an Observer.It is an object with the methods next(v), error(e), and complete().
        // To feed a new value to the Subject, just call next(theValue), and it will be multicasted to the Observers registered to listen to the Subject.
        this.newPeer = new rxjs_1.Subject();
        this.newPeer$ = this.newPeer.asObservable();
        this.notification = new rxjs_1.Subject();
        this.notification$ = this.notification.asObservable();
        this.disconnectedPeer = new rxjs_1.Subject();
        this.disconnectedPeer$ = this.disconnectedPeer.asObservable();
        this.signal = new rxjs_1.Subject();
        this.signal$ = this.signal.asObservable();
    }
    SignalRService.prototype.startConnection = function (userName, roomName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(this.baseUrl + 'signalr')
                            .build();
                        return [4 /*yield*/, this.hubConnection.start()];
                    case 1:
                        _a.sent();
                        console.log("Connection started for user " + userName + " in room " + roomName);
                        this.hubConnection.on('UserJoined', function (data) {
                            _this.newPeer.next(JSON.parse(data));
                        });
                        this.hubConnection.on('SendNotification', function (data) {
                            _this.notification.next(JSON.parse(data));
                        });
                        this.hubConnection.on('UserDisconnected', function (data) {
                            _this.disconnectedPeer.next(JSON.parse(data));
                        });
                        this.hubConnection.on('SendSignal', function (user, signal) {
                            _this.signal.next({ user: user, signal: signal });
                        });
                        this.hubConnection.invoke('OnJoined', userName);
                        return [2 /*return*/];
                }
            });
        });
    };
    SignalRService.prototype.sendNotificationToUser = function (userName, user) {
        this.hubConnection.invoke('SendNotification', userName, user);
    };
    SignalRService.prototype.sendSignalToUser = function (signal, user) {
        this.hubConnection.invoke('SendSignal', signal, user);
    };
    SignalRService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __param(0, core_1.Inject('BASE_URL')),
        __metadata("design:paramtypes", [String])
    ], SignalRService);
    return SignalRService;
}());
exports.SignalRService = SignalRService;
//# sourceMappingURL=signalr.service.js.map
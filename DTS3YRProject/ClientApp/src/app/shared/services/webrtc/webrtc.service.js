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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebrtcService = void 0;
var core_1 = require("@angular/core");
var openvidu_browser_1 = require("openvidu-browser");
var logger_service_1 = require("../logger/logger.service");
var local_users_service_1 = require("../local-users/local-users.service");
var video_type_1 = require("../../types/video-type");
var environment_1 = require("../../../../environments/environment");
var WebrtcService = /** @class */ (function () {
    function WebrtcService(loggerSrv, localUsersSrv) {
        this.loggerSrv = loggerSrv;
        this.localUsersSrv = localUsersSrv;
        this.OV = null;
        this.OVScreen = null;
        this.webcamSession = null;
        this.screenSession = null;
        this.videoSource = undefined;
        this.audioSource = undefined;
        this.screenMediaStream = null;
        this.webcamMediaStream = null;
        this.log = this.loggerSrv.get('WebRTCService');
    }
    WebrtcService.prototype.initialize = function () {
        this.OV = new openvidu_browser_1.OpenVidu();
        this.OVScreen = new openvidu_browser_1.OpenVidu();
        if (environment_1.environment.production) {
            this.OV.enableProdMode();
            this.OVScreen.enableProdMode();
        }
    };
    WebrtcService.prototype.initSessions = function () {
        this.initializeWebcamSession();
        this.initializeScreenSession();
    };
    WebrtcService.prototype.getWebcamSession = function () {
        return this.webcamSession;
    };
    WebrtcService.prototype.isWebcamSessionConnected = function () {
        return !!this.webcamSession.capabilities;
    };
    WebrtcService.prototype.initializeWebcamSession = function () {
        this.webcamSession = this.OV.initSession();
    };
    WebrtcService.prototype.initializeScreenSession = function () {
        this.screenSession = this.OVScreen.initSession();
    };
    WebrtcService.prototype.getScreenSession = function () {
        return this.screenSession;
    };
    WebrtcService.prototype.isScreenSessionConnected = function () {
        return !!this.screenSession.capabilities;
    };
    WebrtcService.prototype.connectWebcamSession = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var webcamUsername, webcamAvatar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!token) return [3 /*break*/, 2];
                        this.log.d('Connecting webcam session');
                        webcamUsername = this.localUsersSrv.getWebcamUserName();
                        webcamAvatar = this.localUsersSrv.getAvatar();
                        return [4 /*yield*/, this.webcamSession.connect(token, { clientData: webcamUsername, avatar: webcamAvatar })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    WebrtcService.prototype.disconnectWebcamSession = function () {
        if (this.webcamSession) {
            this.log.d('Disconnecting webcam session');
            this.webcamSession.disconnect();
            this.webcamSession = null;
        }
    };
    WebrtcService.prototype.connectScreenSession = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var screenUsername, webcamAvatar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!token) return [3 /*break*/, 2];
                        this.log.d('Connecting screen session');
                        screenUsername = this.localUsersSrv.getScreenUserName();
                        webcamAvatar = this.localUsersSrv.getAvatar();
                        return [4 /*yield*/, this.screenSession.connect(token, { clientData: screenUsername, avatar: webcamAvatar })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    WebrtcService.prototype.disconnectScreenSession = function () {
        if (this.screenSession) {
            this.log.d('Disconnecting screen session');
            this.screenSession.disconnect();
            this.screenSession = null;
        }
    };
    WebrtcService.prototype.disconnect = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.disconnectWebcamSession();
        setTimeout(function () {
            // ! Timeout neccessary to avoid race conditin error:
            // ! OpenVidu Error Remote connection unknown when 'onParticipantLeft'. Existing remote connections: []
            _this.disconnectScreenSession();
        }, 100);
        this.videoSource = undefined;
        this.audioSource = undefined;
        this.stopVideoTracks((_b = (_a = this.localUsersSrv.getWebcamPublisher()) === null || _a === void 0 ? void 0 : _a.stream) === null || _b === void 0 ? void 0 : _b.getMediaStream());
        this.stopVideoTracks((_d = (_c = this.localUsersSrv.getScreenPublisher()) === null || _c === void 0 ? void 0 : _c.stream) === null || _d === void 0 ? void 0 : _d.getMediaStream());
        this.stopAudioTracks((_f = (_e = this.localUsersSrv.getWebcamPublisher()) === null || _e === void 0 ? void 0 : _e.stream) === null || _f === void 0 ? void 0 : _f.getMediaStream());
        this.stopAudioTracks((_h = (_g = this.localUsersSrv.getScreenPublisher()) === null || _g === void 0 ? void 0 : _g.stream) === null || _h === void 0 ? void 0 : _h.getMediaStream());
    };
    WebrtcService.prototype.initPublisher = function (targetElement, properties) {
        this.log.d('Initializing publisher with properties: ', properties);
        var publisher = this.OV.initPublisher(targetElement, properties);
        // this.localUsersSrv.setWebcamPublisher(publisher);
        publisher.once('streamPlaying', function () {
            publisher.videos[0].video.parentElement.classList.remove('custom-class');
        });
        return publisher;
    };
    WebrtcService.prototype.initPublisherAsync = function (targetElement, properties) {
        return __awaiter(this, void 0, void 0, function () {
            var publisher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.d('Initializing publisher with properties: ', properties);
                        return [4 /*yield*/, this.OV.initPublisherAsync(targetElement, properties)];
                    case 1:
                        publisher = _a.sent();
                        // this.localUsersSrv.setWebcamPublisher(publisher);
                        publisher.once('streamPlaying', function () {
                            publisher.videos[0].video.parentElement.classList.remove('custom-class');
                        });
                        return [2 /*return*/, publisher];
                }
            });
        });
    };
    WebrtcService.prototype.destroyWebcamPublisher = function () {
        var publisher = this.localUsersSrv.getWebcamPublisher();
        if (!!publisher) {
            // publisher.off('streamAudioVolumeChange');
            publisher.stream.disposeWebRtcPeer();
            publisher.stream.disposeMediaStream();
            this.localUsersSrv.setWebcamPublisher(publisher);
        }
    };
    WebrtcService.prototype.destroyScreenPublisher = function () {
        var publisher = this.localUsersSrv.getScreenPublisher();
        if (!!publisher) {
            // publisher.off('streamAudioVolumeChange');
            publisher.stream.disposeWebRtcPeer();
            publisher.stream.disposeMediaStream();
            this.localUsersSrv.setScreenPublisher(publisher);
        }
    };
    WebrtcService.prototype.publishWebcamPublisher = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var publisher;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!((_b = (_a = this.webcamSession) === null || _a === void 0 ? void 0 : _a.capabilities) === null || _b === void 0 ? void 0 : _b.publish)) return [3 /*break*/, 2];
                        publisher = this.localUsersSrv.getWebcamPublisher();
                        if (!!!publisher) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.webcamSession.publish(publisher)];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        this.log.e('Webcam publisher cannot be published');
                        return [2 /*return*/];
                }
            });
        });
    };
    WebrtcService.prototype.unpublishWebcamPublisher = function () {
        var publisher = this.localUsersSrv.getWebcamPublisher();
        if (!!publisher) {
            this.publishScreenAudio(this.localUsersSrv.hasWebcamAudioActive());
            this.webcamSession.unpublish(publisher);
        }
    };
    WebrtcService.prototype.publishScreenPublisher = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var publisher;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!((_b = (_a = this.screenSession) === null || _a === void 0 ? void 0 : _a.capabilities) === null || _b === void 0 ? void 0 : _b.publish)) return [3 /*break*/, 2];
                        publisher = this.localUsersSrv.getScreenPublisher();
                        if (!!!publisher) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.screenSession.publish(publisher)];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        this.log.e('Screen publisher cannot be published');
                        return [2 /*return*/];
                }
            });
        });
    };
    WebrtcService.prototype.unpublishScreenPublisher = function () {
        var publisher = this.localUsersSrv.getScreenPublisher();
        if (!!publisher) {
            this.screenSession.unpublish(publisher);
        }
    };
    WebrtcService.prototype.publishWebcamVideo = function (active) {
        this.localUsersSrv.getWebcamPublisher().publishVideo(active);
        // Send event to subscribers because of video has changed and view must update
        this.localUsersSrv.updateUsersStatus();
    };
    WebrtcService.prototype.publishWebcamAudio = function (active) {
        var publisher = this.localUsersSrv.getWebcamPublisher();
        if (!!publisher) {
            publisher.publishAudio(active);
        }
    };
    WebrtcService.prototype.publishScreenAudio = function (active) {
        var publisher = this.localUsersSrv.getScreenPublisher();
        if (!!publisher) {
            publisher.publishAudio(active);
        }
    };
    WebrtcService.prototype.replaceTrack = function (videoSource, audioSource, mirror) {
        var _this = this;
        if (mirror === void 0) { mirror = true; }
        return new Promise(function (resolve, reject) {
            if (!!videoSource) {
                _this.log.d('Replacing video track ' + videoSource);
                _this.videoSource = videoSource;
                // this.stopVideoTracks(this.webcamUser.getStreamManager().stream.getMediaStream());
            }
            if (!!audioSource) {
                _this.log.d('Replacing audio track ' + audioSource);
                _this.audioSource = audioSource;
                // this.stopAudioTracks(this.webcamUser.getStreamManager().stream.getMediaStream());
            }
            _this.destroyWebcamPublisher();
            var properties = _this.createPublisherProperties(_this.videoSource, _this.audioSource, _this.localUsersSrv.hasWebcamVideoActive(), _this.localUsersSrv.hasWebcamAudioActive(), mirror);
            var publisher = _this.initPublisher(undefined, properties);
            _this.localUsersSrv.setWebcamPublisher(publisher);
            publisher.once('streamPlaying', function () {
                _this.localUsersSrv.setWebcamPublisher(publisher);
                resolve();
            });
            publisher.once('accessDenied', function () {
                reject();
            });
            // Replace track method
            // this.webcamMediaStream = await this.OV.getUserMedia(properties);
            // const track: MediaStreamTrack = !!videoSource
            // 	? this.webcamMediaStream.getVideoTracks()[0]
            // 	: this.webcamMediaStream.getAudioTracks()[0];
            // try {
            // 	await (<Publisher>this.webcamUser.getStreamManager()).replaceTrack(track);
            // } catch (error) {
            // 	this.log.e('Error replacing track ', error);
            // }
        });
    };
    WebrtcService.prototype.sendSignal = function (type, connection, data) {
        var signalOptions = {
            data: JSON.stringify(data),
            type: type,
            to: connection ? [connection] : undefined
        };
        this.webcamSession.signal(signalOptions);
        // signalOptions.data = JSON.stringify({nickname: this.getScreenUserName()});
        // this.getScreenSession()?.signal(signalOptions);
    };
    // TODO: replace function by sendSignal
    WebrtcService.prototype.sendNicknameSignal = function (connection) {
        var _a, _b;
        if (this.needSendNicknameSignal()) {
            var signalOptions = {
                data: JSON.stringify({ clientData: this.localUsersSrv.getWebcamUserName() }),
                type: 'nicknameChanged',
                to: connection ? [connection] : undefined
            };
            (_a = this.getWebcamSession()) === null || _a === void 0 ? void 0 : _a.signal(signalOptions);
            signalOptions.data = JSON.stringify({ clientData: this.localUsersSrv.getScreenUserName() });
            (_b = this.getScreenSession()) === null || _b === void 0 ? void 0 : _b.signal(signalOptions);
        }
    };
    WebrtcService.prototype.createPublisherProperties = function (videoSource, audioSource, publishVideo, publishAudio, mirror) {
        return {
            videoSource: videoSource,
            audioSource: audioSource,
            publishVideo: publishVideo,
            publishAudio: publishAudio,
            mirror: mirror
        };
    };
    WebrtcService.prototype.replaceScreenTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var videoSource, hasAudio, properties, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        videoSource = video_type_1.ScreenType.SCREEN;
                        hasAudio = !this.localUsersSrv.isWebCamEnabled();
                        properties = this.createPublisherProperties(videoSource, undefined, true, hasAudio, false);
                        this.stopScreenTracks();
                        _a = this;
                        return [4 /*yield*/, this.OVScreen.getUserMedia(properties)];
                    case 1:
                        _a.screenMediaStream = _b.sent();
                        return [4 /*yield*/, this.localUsersSrv.getScreenPublisher().replaceTrack(this.screenMediaStream.getVideoTracks()[0])];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebrtcService.prototype.stopAudioTracks = function (mediaStream) {
        var _a;
        mediaStream === null || mediaStream === void 0 ? void 0 : mediaStream.getAudioTracks().forEach(function (track) {
            track.stop();
            track.enabled = false;
        });
        (_a = this.webcamMediaStream) === null || _a === void 0 ? void 0 : _a.getAudioTracks().forEach(function (track) {
            track.stop();
        });
    };
    WebrtcService.prototype.stopVideoTracks = function (mediaStream) {
        mediaStream === null || mediaStream === void 0 ? void 0 : mediaStream.getVideoTracks().forEach(function (track) {
            track.stop();
        });
    };
    WebrtcService.prototype.needSendNicknameSignal = function () {
        var oldNickname = JSON.parse(this.webcamSession.connection.data).clientData;
        return oldNickname !== this.localUsersSrv.getWebcamUserName();
    };
    WebrtcService.prototype.isMyOwnConnection = function (connectionId) {
        var _a, _b, _c, _d;
        return (((_b = (_a = this.webcamSession) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.connectionId) === connectionId || ((_d = (_c = this.screenSession) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.connectionId) === connectionId);
    };
    WebrtcService.prototype.getSessionOfUserConnected = function () {
        return this.localUsersSrv.isWebCamEnabled() ? this.webcamSession : this.screenSession;
    };
    WebrtcService.prototype.stopScreenTracks = function () {
        if (this.screenMediaStream) {
            this.stopAudioTracks(this.screenMediaStream);
            this.stopVideoTracks(this.screenMediaStream);
        }
    };
    WebrtcService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [logger_service_1.LoggerService, local_users_service_1.LocalUsersService])
    ], WebrtcService);
    return WebrtcService;
}());
exports.WebrtcService = WebrtcService;
//# sourceMappingURL=webrtc.service.js.map
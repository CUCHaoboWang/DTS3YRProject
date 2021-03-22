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
exports.VideoConferencingComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var sidenav_1 = require("@angular/material/sidenav");
var chat_component_1 = require("../shared/components/chat/chat.component");
var video_settings_1 = require("../shared/models/video-settings");
var external_config_1 = require("../shared/models/external-config");
var video_type_1 = require("../shared/types/video-type");
var layout_type_1 = require("../shared/types/layout-type");
var storage_type_1 = require("../shared/types/storage-type");
// Services
var devices_service_1 = require("../shared/services/devices/devices.service");
var logger_service_1 = require("../shared/services/logger/logger.service");
var local_users_service_1 = require("../shared/services/local-users/local-users.service");
var remote_users_service_1 = require("../shared/services/remote-users/remote-users.service");
var utils_service_1 = require("../shared/services/utils/utils.service");
var chat_service_1 = require("../shared/services/chat/chat.service");
var storage_service_1 = require("../shared/services/storage/storage.service");
var layout_service_1 = require("../shared/services/layout/layout.service");
var token_service_1 = require("../shared/services/token/token.service");
var webrtc_service_1 = require("../shared/services/webrtc/webrtc.service");
var VideoConferencingComponent = /** @class */ (function () {
    function VideoConferencingComponent(router, devicesService, loggerSrv, localUsersService, remoteUsersService, utilsSrv, chatService, storageSrv, videoLayout, tokenService, webRTCService) {
        this.router = router;
        this.devicesService = devicesService;
        this.loggerSrv = loggerSrv;
        this.localUsersService = localUsersService;
        this.remoteUsersService = remoteUsersService;
        this.utilsSrv = utilsSrv;
        this.chatService = chatService;
        this.storageSrv = storageSrv;
        this.videoLayout = videoLayout;
        this.tokenService = tokenService;
        this.webRTCService = webRTCService;
        this.compact = false;
        this.sidenavMode = 'side';
        this.showConfigRoomCard = true;
        this.localUsers = [];
        this.remoteUsers = [];
        this.participantsNameList = [];
        this.isAutoLayout = false;
        this.log = this.loggerSrv.get('VideoConferencingComponent');
    }
    VideoConferencingComponent.prototype.beforeunloadHandler = function () {
        this.leaveSession();
    };
    VideoConferencingComponent.prototype.sizeChange = function () {
        this.videoLayout.update();
        this.checkSizeComponent();
    };
    VideoConferencingComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.localUsersService.initialize();
                this.webRTCService.initialize();
                this.lightTheme = false;
                this.videoSettings = new video_settings_1.VideoSettingsModel();
                this.videoSettings.setScreenSharing(this.videoSettings.hasScreenSharing() && !this.utilsSrv.isMobile());
                return [2 /*return*/];
            });
        });
    };
    VideoConferencingComponent.prototype.ngOnDestroy = function () {
        var _a;
        // Reconnecting session is received in Firefox
        // To avoid 'Connection lost' message uses session.off()
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.off('reconnecting');
        this.remoteUsersService.clear();
        this.videoLayout.clear();
        this.localUsersService.clear();
        this.session = null;
        this.sessionScreen = null;
        this.localUsers = [];
        this.remoteUsers = [];
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }
        if (this.remoteUsersSubscription) {
            this.remoteUsersSubscription.unsubscribe();
        }
        if (this.chatSubscription) {
            this.chatSubscription.unsubscribe();
        }
        if (this.remoteUserNameSubscription) {
            this.remoteUserNameSubscription.unsubscribe();
        }
    };
    VideoConferencingComponent.prototype.onConfigRoomJoin = function () {
        var _this = this;
        this.hasVideoDevices = this.devicesService.hasVideoDeviceAvailable();
        this.hasAudioDevices = this.devicesService.hasAudioDeviceAvailable();
        this.showConfigRoomCard = false;
        this.subscribeToLocalUsers();
        this.subscribeToRemoteUsers();
        this.tokenService.initialize(this.videoSettings);
        setTimeout(function () {
            _this.videoLayout.initialize();
            _this.checkSizeComponent();
            _this.joinToSession();
        }, 50);
    };
    VideoConferencingComponent.prototype.joinToSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.webRTCService.initSessions();
                        this.session = this.webRTCService.getWebcamSession();
                        this.sessionScreen = this.webRTCService.getScreenSession();
                        this.subscribeToConnectionCreatedAndDestroyed();
                        this.subscribeToStreamCreated();
                        this.subscribeToStreamDestroyed();
                        this.subscribeToStreamPropertyChange();
                        this.subscribeToNicknameChanged();
                        this.chatService.setChatComponent(this.chatSidenav);
                        this.chatService.subscribeToChat();
                        this.subscribeToChatComponent();
                        this.subscribeToReconnection();
                        return [4 /*yield*/, this.connectToSession()];
                    case 1:
                        _a.sent();
                        // Workaround, firefox does not have audio when publisher join with muted camera
                        if (this.utilsSrv.isFirefox() && !this.localUsersService.hasWebcamVideoActive()) {
                            this.webRTCService.publishWebcamVideo(true);
                            this.webRTCService.publishWebcamVideo(false);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoConferencingComponent.prototype.leaveSession = function () {
        this.log.d('Leaving session...');
        this.webRTCService.disconnect();
        this.router.navigate(['']);
    };
    VideoConferencingComponent.prototype.onNicknameUpdate = function (nickname) {
        this.localUsersService.updateUsersNickname(nickname);
        this.storageSrv.set(storage_type_1.Storage.USER_NAME, nickname);
        this.webRTCService.sendNicknameSignal();
    };
    VideoConferencingComponent.prototype.toggleMic = function () {
        if (this.localUsersService.isWebCamEnabled()) {
            this.webRTCService.publishWebcamAudio(!this.localUsersService.hasWebcamAudioActive());
            return;
        }
        this.webRTCService.publishScreenAudio(!this.localUsersService.hasScreenAudioActive());
    };
    VideoConferencingComponent.prototype.toggleCam = function () {
        return __awaiter(this, void 0, void 0, function () {
            var publishVideo, hasAudio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        publishVideo = !this.localUsersService.hasWebcamVideoActive();
                        // Disabling webcam
                        if (this.localUsersService.areBothConnected()) {
                            this.webRTCService.publishWebcamVideo(publishVideo);
                            this.localUsersService.disableWebcamUser();
                            this.webRTCService.unpublishWebcamPublisher();
                            return [2 /*return*/];
                        }
                        if (!this.localUsersService.isOnlyScreenConnected()) return [3 /*break*/, 4];
                        hasAudio = this.localUsersService.hasScreenAudioActive();
                        if (!!this.webRTCService.isWebcamSessionConnected()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connectWebcamSession()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.webRTCService.publishWebcamPublisher()];
                    case 3:
                        _a.sent();
                        this.webRTCService.publishScreenAudio(false);
                        this.webRTCService.publishWebcamAudio(hasAudio);
                        this.localUsersService.enableWebcamUser();
                        _a.label = 4;
                    case 4:
                        // Muting/unmuting webcam
                        this.webRTCService.publishWebcamVideo(publishVideo);
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoConferencingComponent.prototype.toggleScreenShare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var screenPublisher_1, hasAudio;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Disabling screenShare
                        if (this.localUsersService.areBothConnected()) {
                            this.removeScreen();
                            return [2 /*return*/];
                        }
                        // Enabling screenShare
                        if (this.localUsersService.isOnlyWebcamConnected()) {
                            screenPublisher_1 = this.initScreenPublisher();
                            screenPublisher_1.once('accessAllowed', function (event) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // Listen to event fired when native stop button is clicked
                                            screenPublisher_1.stream
                                                .getMediaStream()
                                                .getVideoTracks()[0]
                                                .addEventListener('ended', function () {
                                                _this.log.d('Clicked native stop button. Stopping screen sharing');
                                                _this.toggleScreenShare();
                                            });
                                            this.log.d('ACCESS ALOWED screenPublisher');
                                            this.localUsersService.enableScreenUser(screenPublisher_1);
                                            if (!!this.webRTCService.isScreenSessionConnected()) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.connectScreenSession()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [4 /*yield*/, this.webRTCService.publishScreenPublisher()];
                                        case 3:
                                            _a.sent();
                                            this.webRTCService.sendNicknameSignal();
                                            if (!this.localUsersService.hasWebcamVideoActive()) {
                                                // Disabling webcam
                                                this.localUsersService.disableWebcamUser();
                                                this.webRTCService.unpublishWebcamPublisher();
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            screenPublisher_1.once('accessDenied', function (event) {
                                _this.log.w('ScreenShare: Access Denied');
                            });
                            return [2 /*return*/];
                        }
                        hasAudio = this.localUsersService.hasScreenAudioActive();
                        return [4 /*yield*/, this.webRTCService.publishWebcamPublisher()];
                    case 1:
                        _a.sent();
                        this.webRTCService.publishScreenAudio(false);
                        this.webRTCService.publishWebcamAudio(hasAudio);
                        this.localUsersService.enableWebcamUser();
                        this.removeScreen();
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoConferencingComponent.prototype.toggleSpeakerLayout = function () {
        if (!this.localUsersService.isScreenShareEnabled()) {
            this.isAutoLayout = !this.isAutoLayout;
            this.log.d('Automatic Layout ', this.isAutoLayout ? 'Disabled' : 'Enabled');
            if (this.isAutoLayout) {
                this.subscribeToSpeechDetection();
                return;
            }
            this.log.d('Unsubscribe to speech detection');
            this.session.off('publisherStartSpeaking');
            this.resetAllBigElements();
            this.videoLayout.update();
            return;
        }
        this.log.w('Screen is enabled. Speech detection has been rejected');
    };
    VideoConferencingComponent.prototype.onReplaceScreenTrack = function (event) {
        this.webRTCService.replaceScreenTrack();
    };
    VideoConferencingComponent.prototype.checkSizeComponent = function () {
        var _a;
        this.compact = ((_a = document.getElementById('room-container')) === null || _a === void 0 ? void 0 : _a.offsetWidth) <= 790;
        this.sidenavMode = this.compact ? 'over' : 'side';
    };
    VideoConferencingComponent.prototype.onToggleVideoSize = function (event) {
        var element = event.element;
        if (!!event.resetAll) {
            this.resetAllBigElements();
        }
        this.utilsSrv.toggleBigElementClass(element);
        // Has been mandatory change the user zoom property here because of
        // zoom icons and cannot handle publisherStartSpeaking event in other component
        if (!!(event === null || event === void 0 ? void 0 : event.connectionId)) {
            if (this.webRTCService.isMyOwnConnection(event.connectionId)) {
                this.localUsersService.toggleZoom(event.connectionId);
            }
            else {
                this.remoteUsersService.toggleUserZoom(event.connectionId);
            }
        }
        this.videoLayout.update();
    };
    VideoConferencingComponent.prototype.toolbarMicIconEnabled = function () {
        if (this.localUsersService.isWebCamEnabled()) {
            return this.localUsersService.hasWebcamAudioActive();
        }
        return this.localUsersService.hasScreenAudioActive();
    };
    VideoConferencingComponent.prototype.connectToSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Initialize tokens from externalConfig or create new ones
                        return [4 /*yield*/, this.tokenService.initTokens(this.externalConfig)];
                    case 1:
                        // Initialize tokens from externalConfig or create new ones
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.log.e('There was an error initializing the token:', error_1.status, error_1.message);
                        this.utilsSrv.showErrorMessage('There was an error initializing the token:', error_1.error || error_1.message);
                        return [3 /*break*/, 3];
                    case 3:
                        if (!this.localUsersService.areBothConnected()) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.connectWebcamSession()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.connectScreenSession()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.webRTCService.publishWebcamPublisher()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.webRTCService.publishScreenPublisher()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 8:
                        if (!this.localUsersService.isOnlyScreenConnected()) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.connectScreenSession()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.webRTCService.publishScreenPublisher()];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 11: return [4 /*yield*/, this.connectWebcamSession()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.webRTCService.publishWebcamPublisher()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        this.videoLayout.update();
                        return [2 /*return*/];
                }
            });
        });
    };
    VideoConferencingComponent.prototype.connectScreenSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.webRTCService.connectScreenSession(this.tokenService.getScreenToken())];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.log.e('There was an error connecting to the session:', error_2.code, error_2.message);
                        this.utilsSrv.showErrorMessage('There was an error connecting to the session:', (error_2 === null || error_2 === void 0 ? void 0 : error_2.error) || (error_2 === null || error_2 === void 0 ? void 0 : error_2.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VideoConferencingComponent.prototype.connectWebcamSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.webRTCService.connectWebcamSession(this.tokenService.getWebcamToken())];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        this.log.e('There was an error connecting to the session:', error_3.code, error_3.message);
                        this.utilsSrv.showErrorMessage('There was an error connecting to the session:', (error_3 === null || error_3 === void 0 ? void 0 : error_3.error) || (error_3 === null || error_3 === void 0 ? void 0 : error_3.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VideoConferencingComponent.prototype.subscribeToConnectionCreatedAndDestroyed = function () {
        var _this = this;
        this.session.on('connectionCreated', function (event) {
            if (_this.webRTCService.isMyOwnConnection(event.connection.connectionId)) {
                return;
            }
            var nickname = _this.utilsSrv.getNicknameFromConnectionData(event.connection.data);
            _this.remoteUsersService.addUserName(event);
            // Adding participant when connection is created
            if (!(nickname === null || nickname === void 0 ? void 0 : nickname.includes('_' + video_type_1.VideoType.SCREEN))) {
                _this.remoteUsersService.add(event, null);
                _this.webRTCService.sendNicknameSignal(event.connection);
            }
        });
        this.session.on('connectionDestroyed', function (event) {
            if (_this.webRTCService.isMyOwnConnection(event.connection.connectionId)) {
                return;
            }
            _this.remoteUsersService.deleteUserName(event);
            var nickname = _this.utilsSrv.getNicknameFromConnectionData(event.connection.data);
            // Deleting participant when connection is destroyed
            if (!(nickname === null || nickname === void 0 ? void 0 : nickname.includes('_' + video_type_1.VideoType.SCREEN))) {
                _this.remoteUsersService.removeUserByConnectionId(event.connection.connectionId);
            }
        });
    };
    VideoConferencingComponent.prototype.subscribeToStreamCreated = function () {
        var _this = this;
        this.session.on('streamCreated', function (event) {
            var connectionId = event.stream.connection.connectionId;
            if (_this.webRTCService.isMyOwnConnection(connectionId)) {
                return;
            }
            var subscriber = _this.session.subscribe(event.stream, undefined);
            _this.remoteUsersService.add(event, subscriber);
            // this.oVSessionService.sendNicknameSignal(event.stream.connection);
        });
    };
    VideoConferencingComponent.prototype.subscribeToStreamDestroyed = function () {
        var _this = this;
        this.session.on('streamDestroyed', function (event) {
            var connectionId = event.stream.connection.connectionId;
            _this.remoteUsersService.removeUserByConnectionId(connectionId);
            // event.preventDefault();
        });
    };
    // Emit publisher to webcomponent
    //emitPublisher(publisher: Publisher) {
    //  this._publisher.emit(publisher);
    //}
    VideoConferencingComponent.prototype.subscribeToStreamPropertyChange = function () {
        var _this = this;
        this.session.on('streamPropertyChanged', function (event) {
            var connectionId = event.stream.connection.connectionId;
            if (_this.webRTCService.isMyOwnConnection(connectionId)) {
                return;
            }
            if (event.changedProperty === 'videoActive') {
                _this.remoteUsersService.updateUsers();
            }
        });
    };
    VideoConferencingComponent.prototype.subscribeToNicknameChanged = function () {
        var _this = this;
        this.session.on('signal:nicknameChanged', function (event) {
            var connectionId = event.from.connectionId;
            if (_this.webRTCService.isMyOwnConnection(connectionId)) {
                return;
            }
            var nickname = _this.utilsSrv.getNicknameFromConnectionData(event.data);
            _this.remoteUsersService.updateNickname(connectionId, nickname);
        });
    };
    VideoConferencingComponent.prototype.subscribeToSpeechDetection = function () {
        var _this = this;
        this.log.d('Subscribe to speech detection', this.session);
        // Has been mandatory change the user zoom property here because of
        // zoom icons and cannot handle publisherStartSpeaking event in other component
        this.session.on('publisherStartSpeaking', function (event) {
            var someoneIsSharingScreen = _this.remoteUsersService.someoneIsSharingScreen();
            if (!_this.localUsersService.isScreenShareEnabled() && !someoneIsSharingScreen) {
                var elem = event.connection.stream.streamManager.videos[0].video;
                var element = _this.utilsSrv.getHTMLElementByClassName(elem, layout_type_1.LayoutType.ROOT_CLASS);
                _this.resetAllBigElements();
                _this.remoteUsersService.setUserZoom(event.connection.connectionId, true);
                _this.onToggleVideoSize({ element: element });
            }
        });
    };
    VideoConferencingComponent.prototype.removeScreen = function () {
        this.localUsersService.disableScreenUser();
        this.webRTCService.unpublishScreenPublisher();
    };
    VideoConferencingComponent.prototype.subscribeToChatComponent = function () {
        var _this = this;
        this.chatSubscription = this.chatService.toggleChatObs.subscribe(function (opened) {
            var timeout = 0;
            _this.videoLayout.update(timeout);
        });
    };
    VideoConferencingComponent.prototype.subscribeToReconnection = function () {
        var _this = this;
        this.session.on('reconnecting', function () {
            _this.log.w('Connection lost: Reconnecting');
            _this.isConnectionLost = true;
            _this.utilsSrv.showErrorMessage('Connection Problem', 'Oops! Trying to reconnect to the session ...', true);
        });
        this.session.on('reconnected', function () {
            _this.log.w('Connection lost: Reconnected');
            _this.isConnectionLost = false;
            _this.utilsSrv.closeDialog();
        });
        this.session.on('sessionDisconnected', function (event) {
            if (event.reason === 'networkDisconnect') {
                _this.utilsSrv.closeDialog();
                _this.leaveSession();
            }
        });
    };
    VideoConferencingComponent.prototype.initScreenPublisher = function () {
        var videoSource = video_type_1.ScreenType.SCREEN;
        var audioSource = this.hasAudioDevices ? undefined : null;
        var willThereBeWebcam = this.localUsersService.isWebCamEnabled() && this.localUsersService.hasWebcamVideoActive();
        var hasAudio = willThereBeWebcam ? false : this.hasAudioDevices && this.localUsersService.hasWebcamAudioActive();
        var properties = this.webRTCService.createPublisherProperties(videoSource, audioSource, true, hasAudio, false);
        try {
            return this.webRTCService.initPublisher(undefined, properties);
        }
        catch (error) {
            this.log.e(error);
            this.utilsSrv.handleScreenShareError(error);
        }
    };
    VideoConferencingComponent.prototype.resetAllBigElements = function () {
        this.utilsSrv.removeAllBigElementClass();
        this.remoteUsersService.resetUsersZoom();
        this.localUsersService.resetUsersZoom();
    };
    VideoConferencingComponent.prototype.subscribeToLocalUsers = function () {
        var _this = this;
        this.usersSubscription = this.localUsersService.Users.subscribe(function (users) {
            _this.localUsers = users;
            _this.videoLayout.update();
        });
    };
    VideoConferencingComponent.prototype.subscribeToRemoteUsers = function () {
        var _this = this;
        this.remoteUsersSubscription = this.remoteUsersService.remoteUsers.subscribe(function (users) {
            _this.remoteUsers = __spreadArrays(users);
            _this.videoLayout.update();
        });
        this.remoteUserNameSubscription = this.remoteUsersService.remoteUserNameList.subscribe(function (names) {
            _this.participantsNameList = __spreadArrays(names);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", external_config_1.ExternalConfigModel)
    ], VideoConferencingComponent.prototype, "externalConfig", void 0);
    __decorate([
        core_1.ViewChild('chatComponent'),
        __metadata("design:type", chat_component_1.ChatComponent)
    ], VideoConferencingComponent.prototype, "chatComponent", void 0);
    __decorate([
        core_1.ViewChild('sidenav'),
        __metadata("design:type", sidenav_1.MatSidenav)
    ], VideoConferencingComponent.prototype, "chatSidenav", void 0);
    __decorate([
        core_1.HostListener('window:beforeunload'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], VideoConferencingComponent.prototype, "beforeunloadHandler", null);
    __decorate([
        core_1.HostListener('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], VideoConferencingComponent.prototype, "sizeChange", null);
    VideoConferencingComponent = __decorate([
        core_1.Component({
            selector: 'app-video-conferencing',
            templateUrl: './video-conferencing.component.html',
            styleUrls: ['./video-conferencing.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            devices_service_1.DevicesService,
            logger_service_1.LoggerService,
            local_users_service_1.LocalUsersService,
            remote_users_service_1.RemoteUsersService,
            utils_service_1.UtilsService,
            chat_service_1.ChatService,
            storage_service_1.StorageService,
            layout_service_1.VideoLayoutService,
            token_service_1.TokenService,
            webrtc_service_1.WebrtcService])
    ], VideoConferencingComponent);
    return VideoConferencingComponent;
}());
exports.VideoConferencingComponent = VideoConferencingComponent;
//# sourceMappingURL=video-conferencing.component.js.map
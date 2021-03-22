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
exports.VideoStreamingComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var firestore_1 = require("@angular/fire/firestore");
var logger_service_1 = require("../shared/services/logger/logger.service");
var webrtc_firebase_service_1 = require("../shared/services/webrtc-firebase/webrtc-firebase.service");
var rxjs_1 = require("rxjs");
var getObservable = function (collection) {
    var subject = new rxjs_1.BehaviorSubject([]);
    collection.valueChanges({ idField: 'id' }).subscribe(function (val) {
        subject.next(val);
    });
    return subject;
};
var VideoStreamingComponent = /** @class */ (function () {
    function VideoStreamingComponent(router, route, loggerSrv, webRTCService, fireStore) {
        this.router = router;
        this.route = route;
        this.loggerSrv = loggerSrv;
        this.webRTCService = webRTCService;
        this.fireStore = fireStore;
        this.collectionName = 'calls';
        this.log = this.loggerSrv.get('VideoStreamingComponent');
    }
    VideoStreamingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.myNickName = params.userName;
            _this.mySessionId = params.roomName;
        });
        // Reference Firestore collections for signaling
        this.callDoc = this.fireStore.collection(this.collectionName).doc(this.mySessionId);
        this.offerCandidatesCollection = this.callDoc.collection('offerCandidates');
        this.answerCandidatesCollection = this.callDoc.collection('answerCandidates');
        this.offerCandidatesObservables = getObservable(this.offerCandidatesCollection);
        this.answerCandidatesObservables = getObservable(this.answerCandidatesCollection);
        // Use google stun server
        this.servers = {
            iceServers: [
                {
                    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
                },
            ],
            iceCandidatePoolSize: 10,
        };
        this.peerConnection = new RTCPeerConnection(this.servers);
        this.initLocalUser();
    };
    VideoStreamingComponent.prototype.initLocalUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                    case 1:
                        _a.localStream = _b.sent();
                        this.remoteStream = new MediaStream();
                        this.localStream.getTracks().forEach(function (track) {
                            _this.peerConnection.addTrack(track, _this.localStream);
                        });
                        this.videoPlayerLocal.nativeElement.srcObject = this.localStream;
                        if (this.localStream) {
                            this.videoPlayerLocal.nativeElement.load();
                            this.videoPlayerLocal.nativeElement.play();
                        }
                        this.videoPlayerRemote.nativeElement.srcObject = this.remoteStream;
                        this.peerConnection.ontrack = function (event) {
                            event.streams[0].getTracks().forEach(function (track) {
                                _this.remoteStream.addTrack(track);
                                if (_this.remoteStream.getTracks().length > 0) {
                                    _this.videoPlayerRemote.nativeElement.load();
                                    _this.videoPlayerRemote.nativeElement.play();
                                }
                            });
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    // CREATE OFFER
    VideoStreamingComponent.prototype.createOffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offerDescription, offer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.d("Firestore Call Document Reference Id: " + this.mySessionId);
                        // Get candidates for caller, save to db
                        // An ice canditate contains a potential ip address and port pair that can be used to establish the peer-to-peer connection
                        this.peerConnection.onicecandidate = function (event) {
                            event.candidate && _this.offerCandidatesCollection.add(event.candidate.toJSON());
                        };
                        return [4 /*yield*/, this.peerConnection.createOffer()];
                    case 1:
                        offerDescription = _a.sent();
                        return [4 /*yield*/, this.peerConnection.setLocalDescription(offerDescription)];
                    case 2:
                        _a.sent();
                        offer = {
                            sdp: offerDescription.sdp,
                            type: offerDescription.type,
                        };
                        return [4 /*yield*/, this.callDoc.set({ offer: offer })];
                    case 3:
                        _a.sent();
                        // Listen for remote answer
                        //this.callDoc.get().subscribe((doc) => {
                        //  const data = doc.data() as DocInfo;
                        //  console.log('Create Offer CallDoc onValueChanges');
                        //  console.log(data);
                        //  if (!this.peerConnection.currentRemoteDescription && data?.answer) {
                        //    const answerDescription = new RTCSessionDescription(data.answer);
                        //    this.peerConnection.setRemoteDescription(answerDescription);
                        //  }
                        //})
                        // Listen for remote answer
                        this.callDoc.snapshotChanges().forEach(function (change) {
                            var data = change.payload.data();
                            console.log('Create Offer CallDoc onSnapshotChanges');
                            console.log(data);
                            if (!_this.peerConnection.currentRemoteDescription && (data === null || data === void 0 ? void 0 : data.answer)) {
                                var answerDescription = new RTCSessionDescription(data.answer);
                                _this.peerConnection.setRemoteDescription(answerDescription);
                            }
                        });
                        // When answered, add candidate to peer connection
                        //this.answerCandidatesCollection.get().subscribe((collection) => {
                        //  collection.docChanges().forEach((change) => {
                        //    console.log('Create Offer Answer Candidates onDocChanges');
                        //    console.log(change);
                        //    if (change.type === 'added') {
                        //      this.peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                        //    }
                        //  })
                        //});
                        this.answerCandidatesCollection.snapshotChanges().forEach(function (changes) {
                            changes.forEach(function (change) {
                                console.log('Create Offer Answer Candidates onSnapshotChanges');
                                console.log(change.payload.doc.data());
                                if (change.type === 'added') {
                                    _this.peerConnection.addIceCandidate(new RTCIceCandidate(change.payload.doc.data()));
                                }
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ANSWER OFFER TEST
    //public async answerOffer() {
    //  // Reference Firestore collections for signaling
    //  const callDoc = this.fireStore.collection(this.collectionName).doc(this.callId);
    //  const offerCandidatesCollection: AngularFirestoreCollection<RTCIceCandidateInit> = callDoc.collection('offerCandidates');
    //  const answerCandidatesCollection: AngularFirestoreCollection<RTCIceCandidateInit> = callDoc.collection('answerCandidates');
    //  this.log.d(`Firestore Call Document Reference Id: ${this.callId}`);
    //  const calls = this.fireStore.collection(this.collectionName).doc(this.callId).valueChanges({ idField: 'id' });
    //  const offerCandidates = getObservable(this.fireStore.collection(this.collectionName).doc(this.callId).collection('offerCandidates'));
    //  const answerCandidates = getObservable(this.fireStore.collection(this.collectionName).doc(this.callId).collection('answerCandidates'));
    //  console.log(callDoc.snapshotChanges());
    //  console.log(offerCandidatesCollection.snapshotChanges());
    //  console.log(answerCandidatesCollection.snapshotChanges());
    //  console.log(calls);
    //  console.log(offerCandidates.getValue());
    //  console.log(answerCandidates.getValue());
    //  callDoc.get().subscribe((doc) => {
    //    console.log(doc.data());
    //  });
    //  offerCandidatesCollection.get().subscribe((collection) => {
    //    collection.docs.forEach((doc) => {
    //      console.log(doc.data());
    //    });
    //  });
    //}
    // ANSWER OFFER
    VideoStreamingComponent.prototype.answerOffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.log.d("Firestore Call Document Reference Id: " + this.mySessionId);
                // Get candidates for answerer, save to db
                this.peerConnection.onicecandidate = function (event) {
                    event.candidate && _this.answerCandidatesCollection.add(event.candidate.toJSON());
                };
                // Get offer
                this.callDoc.get().subscribe(function (doc) {
                    console.log('Answer Offer CallDoc onValueChanges');
                    console.log(doc.data());
                    var offer = doc.data().offer;
                    console.log('Answer Offer CallDoc onValueChanges offerDescription');
                    console.log(offer);
                    var offerDescription = new RTCSessionDescription(offer);
                    _this.peerConnection.setRemoteDescription(offerDescription);
                    // Create answer
                    _this.peerConnection.createAnswer().then(function (answerDescription) {
                        _this.peerConnection.setLocalDescription(answerDescription);
                        var answer = {
                            sdp: answerDescription.sdp,
                            type: answerDescription.type
                        };
                        _this.callDoc.update({ answer: answer });
                    });
                });
                // When answered, add candidate to peer connection
                //this.offerCandidatesCollection.get().subscribe((collection) => {
                //  collection.docChanges().forEach((change) => {
                //    console.log('Answer Offer Offer Candidates onDocChanges');
                //    console.log(change);
                //    if (change.type === 'added') {
                //      this.peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                //    }
                //  })
                //})
                this.offerCandidatesCollection.snapshotChanges().forEach(function (changes) {
                    changes.forEach(function (change) {
                        console.log('Answer Offer Offer Candidates onSnapshotChanges');
                        console.log(change.payload.doc.data());
                        if (change.type === 'added') {
                            _this.peerConnection.addIceCandidate(new RTCIceCandidate(change.payload.doc.data()));
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    VideoStreamingComponent.prototype.stopStreamedVideo = function () {
        var stream = this.localStream;
        var tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        this.videoPlayerLocal.nativeElement.srcObject = null;
    };
    VideoStreamingComponent.prototype.leaveSession = function () {
        this.log.d('Leaving session...');
        this.stopStreamedVideo();
        this.router.navigate(['']);
    };
    VideoStreamingComponent.prototype.beforeunloadHandler = function () {
        this.leaveSession();
    };
    VideoStreamingComponent.prototype.ngOnDestroy = function () {
        this.leaveSession();
    };
    __decorate([
        core_1.ViewChild('videoPlayerLocal'),
        __metadata("design:type", core_1.ElementRef)
    ], VideoStreamingComponent.prototype, "videoPlayerLocal", void 0);
    __decorate([
        core_1.ViewChild('videoPlayerRemote'),
        __metadata("design:type", core_1.ElementRef)
    ], VideoStreamingComponent.prototype, "videoPlayerRemote", void 0);
    __decorate([
        core_1.HostListener('window:beforeunload'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], VideoStreamingComponent.prototype, "beforeunloadHandler", null);
    VideoStreamingComponent = __decorate([
        core_1.Component({
            selector: 'app-video-streaming',
            templateUrl: './video-streaming.component.html',
            styleUrls: ['./video-streaming.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_1.ActivatedRoute,
            logger_service_1.LoggerService,
            webrtc_firebase_service_1.WebrtcFirebaseService,
            firestore_1.AngularFirestore])
    ], VideoStreamingComponent);
    return VideoStreamingComponent;
}());
exports.VideoStreamingComponent = VideoStreamingComponent;
//# sourceMappingURL=video-streaming.component.js.map
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
exports.NetworkService = void 0;
var core_1 = require("@angular/core");
var logger_service_1 = require("../logger/logger.service");
var throwError_1 = require("rxjs/internal/observable/throwError");
var http_1 = require("@angular/common/http");
var catchError_1 = require("rxjs/internal/operators/catchError");
var NetworkService = /** @class */ (function () {
    function NetworkService(http, loggerSrv) {
        this.http = http;
        this.loggerSrv = loggerSrv;
        this.OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
        this.OPENVIDU_SERVER_SECRET = 'MY_SECRET';
        this.log = this.loggerSrv.get('NetworkService');
        this.baseHref = '/' + (!!window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] + '/' : '');
    }
    NetworkService.prototype.getToken = function (sessionId, openviduServerUrl, openviduSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var _sessionId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!!openviduServerUrl && !!openviduSecret)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createSession(sessionId, openviduServerUrl, openviduSecret)];
                    case 1:
                        _sessionId = _a.sent();
                        return [4 /*yield*/, this.createToken(_sessionId, openviduServerUrl, openviduSecret)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        try {
                            this.log.d('Getting token from backend');
                            //return await this.http.post<any>(this.baseHref + 'api/session', { sessionId }).toPromise();
                            return [2 /*return*/, this.createSession(sessionId, openviduServerUrl, openviduSecret).then(function (sessionId) {
                                    return _this.createToken(sessionId, openviduServerUrl, openviduSecret);
                                })];
                        }
                        catch (error) {
                            if (error.status === 404) {
                                throw { status: error.status, message: 'Cannot connect with backend. ' + error.url + ' not found' };
                            }
                            throw error;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //createSession(sessionId: string, openviduServerUrl: string, openviduSecret: string): Promise<string> {
    //  return new Promise((resolve, reject) => {
    //    const body = JSON.stringify({ customSessionId: sessionId });
    //    const options = {
    //      headers: new HttpHeaders({
    //        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
    //        'Content-Type': 'application/json'
    //      })
    //    };
    //    return this.http
    //      .post<any>(openviduServerUrl + '/openvidu/api/sessions', body, options)
    //      .pipe(
    //        catchError(error => {
    //          if (error.status === 409) {
    //            resolve(sessionId);
    //          }
    //          if (error.statusText === 'Unknown Error') {
    //            reject({ status: 401, message: 'ERR_CERT_AUTHORITY_INVALID' });
    //          }
    //          return observableThrowError(error);
    //        })
    //      )
    //      .subscribe(response => {
    //        resolve(response.id);
    //      });
    //  });
    //}
    //createToken(sessionId: string, openviduServerUrl: string, openviduSecret: string): Promise<string> {
    //  return new Promise((resolve, reject) => {
    //    const body = JSON.stringify({});
    //    const options = {
    //      headers: new HttpHeaders({
    //        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
    //        'Content-Type': 'application/json'
    //      })
    //    };
    //    return this.http
    //      .post<any>(openviduServerUrl + '/openvidu/api/sessions/' + sessionId + '/connection', body, options)
    //      .pipe(
    //        catchError(error => {
    //          reject(error);
    //          return observableThrowError(error);
    //        })
    //      )
    //      .subscribe(response => {
    //        this.log.d(response);
    //        resolve(response.token);
    //      });
    //  });
    //}
    NetworkService.prototype.createSession = function (sessionId, openviduServerUrl, openviduSecret) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var body = JSON.stringify({ customSessionId: sessionId });
            var options = {
                headers: new http_1.HttpHeaders({
                    'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + _this.OPENVIDU_SERVER_SECRET),
                    'Content-Type': 'application/json'
                })
            };
            return _this.http.post(_this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions', body, options)
                .pipe(catchError_1.catchError(function (error) {
                if (error.status === 409) {
                    resolve(sessionId);
                }
                else {
                    console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + _this.OPENVIDU_SERVER_URL);
                    if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + _this.OPENVIDU_SERVER_URL +
                        '\"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server' +
                        'is up and running at "' + _this.OPENVIDU_SERVER_URL + '"')) {
                        location.assign(_this.OPENVIDU_SERVER_URL + '/accept-certificate');
                    }
                }
                return throwError_1.throwError(error);
            }))
                .subscribe(function (response) {
                console.log(response);
                resolve(response['id']);
            });
        });
    };
    NetworkService.prototype.createToken = function (sessionId, openviduServerUrl, openviduSecret) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var body = {};
            var options = {
                headers: new http_1.HttpHeaders({
                    'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + _this.OPENVIDU_SERVER_SECRET),
                    'Content-Type': 'application/json'
                })
            };
            return _this.http.post(_this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions/' + sessionId + '/connection', body, options)
                .pipe(catchError_1.catchError(function (error) {
                reject(error);
                return throwError_1.throwError(error);
            }))
                .subscribe(function (response) {
                console.log(response);
                resolve(response['token']);
            });
        });
    };
    NetworkService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, logger_service_1.LoggerService])
    ], NetworkService);
    return NetworkService;
}());
exports.NetworkService = NetworkService;
//# sourceMappingURL=network.service.js.map
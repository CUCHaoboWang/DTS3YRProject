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
exports.DevicesService = void 0;
var core_1 = require("@angular/core");
var openvidu_browser_1 = require("openvidu-browser");
var device_type_1 = require("../../types/device-type");
var logger_service_1 = require("../logger/logger.service");
var utils_service_1 = require("../utils/utils.service");
var storage_service_1 = require("../storage/storage.service");
var storage_type_1 = require("../../types/storage-type");
var DevicesService = /** @class */ (function () {
    function DevicesService(loggerSrv, utilSrv, storageSrv) {
        this.loggerSrv = loggerSrv;
        this.utilSrv = utilSrv;
        this.storageSrv = storageSrv;
        this.OV = null;
        this.cameras = [];
        this.microphones = [];
        this.log = this.loggerSrv.get('DevicesService');
        this.OV = new openvidu_browser_1.OpenVidu();
    }
    DevicesService.prototype.initDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initOpenViduDevices()];
                    case 1:
                        _a.sent();
                        this.devices.length > 0 ? this.log.d('Devices found: ', this.devices) : this.log.w('No devices found!');
                        this.resetDevicesArray();
                        if (this.hasAudioDeviceAvailable()) {
                            this.initAudioDevices();
                            this.micSelected = this.getMicSelected();
                        }
                        if (this.hasVideoDeviceAvailable()) {
                            this.initVideoDevices();
                            this.camSelected = this.cameras.find(function (device) { return device.type === device_type_1.CameraType.FRONT; });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DevicesService.prototype.initOpenViduDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.OV.getDevices()];
                    case 1:
                        _a.devices = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevicesService.prototype.initAudioDevices = function () {
        var _this = this;
        var audioDevices = this.devices.filter(function (device) { return device.kind === 'audioinput'; });
        audioDevices.forEach(function (device) {
            _this.microphones.push({ label: device.label, device: device.deviceId });
        });
    };
    DevicesService.prototype.initVideoDevices = function () {
        var _this = this;
        var FIRST_POSITION = 0;
        var videoDevices = this.devices.filter(function (device) { return device.kind === 'videoinput'; });
        videoDevices.forEach(function (device, index) {
            var myDevice = {
                label: device.label,
                device: device.deviceId,
                type: device_type_1.CameraType.BACK
            };
            if (_this.utilSrv.isMobile()) {
                // We assume front video device has 'front' in its label in Mobile devices
                if (myDevice.label.toLowerCase().includes(device_type_1.CameraType.FRONT.toLowerCase())) {
                    myDevice.type = device_type_1.CameraType.FRONT;
                }
            }
            else {
                // We assume first device is web camera in Browser Desktop
                if (index === FIRST_POSITION) {
                    myDevice.type = device_type_1.CameraType.FRONT;
                }
            }
            _this.cameras.push(myDevice);
        });
        this.log.d('Camera selected', this.camSelected);
    };
    DevicesService.prototype.getCamSelected = function () {
        if (this.cameras.length === 0) {
            this.log.e('No video devices found!');
            return;
        }
        var storageDevice = this.getCamFromStorage();
        if (storageDevice) {
            return storageDevice;
        }
        return this.camSelected || this.cameras[0];
    };
    DevicesService.prototype.getCamFromStorage = function () {
        var storageDevice = this.storageSrv.get(storage_type_1.Storage.VIDEO_DEVICE);
        storageDevice = this.getCameraByDeviceField(storageDevice === null || storageDevice === void 0 ? void 0 : storageDevice.device);
        if (storageDevice) {
            return storageDevice;
        }
    };
    DevicesService.prototype.getMicSelected = function () {
        if (this.microphones.length === 0) {
            this.log.e('No audio devices found!');
            return;
        }
        var storageDevice = this.getMicFromStogare();
        if (storageDevice) {
            return storageDevice;
        }
        return this.micSelected || this.microphones[0];
    };
    DevicesService.prototype.getMicFromStogare = function () {
        var storageDevice = this.storageSrv.get(storage_type_1.Storage.AUDIO_DEVICE);
        storageDevice = this.getMicrophoneByDeviceField(storageDevice === null || storageDevice === void 0 ? void 0 : storageDevice.device);
        if (storageDevice) {
            return storageDevice;
        }
    };
    DevicesService.prototype.setCamSelected = function (deviceField) {
        this.camSelected = this.getCameraByDeviceField(deviceField);
        this.saveCamToStorage(this.camSelected);
    };
    DevicesService.prototype.saveCamToStorage = function (cam) {
        this.storageSrv.set(storage_type_1.Storage.VIDEO_DEVICE, cam);
    };
    DevicesService.prototype.setMicSelected = function (deviceField) {
        this.micSelected = this.getMicrophoneByDeviceField(deviceField);
        this.saveMicToStorage(this.micSelected);
    };
    DevicesService.prototype.saveMicToStorage = function (mic) {
        this.storageSrv.set(storage_type_1.Storage.AUDIO_DEVICE, mic);
    };
    DevicesService.prototype.needUpdateVideoTrack = function (newVideoSource) {
        return this.getCamSelected().device !== newVideoSource;
    };
    DevicesService.prototype.needUpdateAudioTrack = function (newAudioSource) {
        return this.getMicSelected().device !== newAudioSource;
    };
    DevicesService.prototype.getCameras = function () {
        return this.cameras;
    };
    DevicesService.prototype.getMicrophones = function () {
        return this.microphones;
    };
    DevicesService.prototype.hasVideoDeviceAvailable = function () {
        var _a;
        return !this.videoDevicesDisabled && !!((_a = this.devices) === null || _a === void 0 ? void 0 : _a.find(function (device) { return device.kind === 'videoinput'; }));
    };
    DevicesService.prototype.hasAudioDeviceAvailable = function () {
        var _a;
        return !!((_a = this.devices) === null || _a === void 0 ? void 0 : _a.find(function (device) { return device.kind === 'audioinput'; }));
    };
    DevicesService.prototype.cameraNeedsMirror = function (deviceField) {
        var _a;
        return ((_a = this.getCameraByDeviceField(deviceField)) === null || _a === void 0 ? void 0 : _a.type) === device_type_1.CameraType.FRONT;
    };
    DevicesService.prototype.areEmptyLabels = function () {
        return !!this.cameras.find(function (device) { return device.label === ''; }) || !!this.microphones.find(function (device) { return device.label === ''; });
    };
    DevicesService.prototype.disableVideoDevices = function () {
        this.videoDevicesDisabled = true;
    };
    DevicesService.prototype.clear = function () {
        this.OV = new openvidu_browser_1.OpenVidu();
        this.devices = [];
        this.cameras = [];
        this.microphones = [];
        this.camSelected = null;
        this.micSelected = null;
        this.videoDevicesDisabled = false;
    };
    DevicesService.prototype.getCameraByDeviceField = function (deviceField) {
        return this.cameras.find(function (opt) { return opt.device === deviceField || opt.label === deviceField; });
    };
    DevicesService.prototype.getMicrophoneByDeviceField = function (deviceField) {
        return this.microphones.find(function (opt) { return opt.device === deviceField || opt.label === deviceField; });
    };
    DevicesService.prototype.resetDevicesArray = function () {
        this.cameras = [{ label: 'None', device: null, type: null }];
        this.microphones = [{ label: 'None', device: null, type: null }];
    };
    DevicesService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [logger_service_1.LoggerService, utils_service_1.UtilsService, storage_service_1.StorageService])
    ], DevicesService);
    return DevicesService;
}());
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map
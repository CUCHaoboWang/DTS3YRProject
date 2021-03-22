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
exports.StorageService = void 0;
var core_1 = require("@angular/core");
var logger_service_1 = require("../logger/logger.service");
var StorageService = /** @class */ (function () {
    function StorageService(loggerSrv) {
        this.loggerSrv = loggerSrv;
        this.storage = window.localStorage;
        this.log = this.loggerSrv.get('StorageService');
    }
    StorageService.prototype.set = function (key, item) {
        var value = JSON.stringify({ item: item });
        this.log.d('Storing on localStorage "' + key + '" with value "' + value + '"');
        this.storage.setItem(key, value);
    };
    StorageService.prototype.get = function (key) {
        var value = JSON.parse(this.storage.getItem(key));
        return (value === null || value === void 0 ? void 0 : value.item) ? value.item : null;
    };
    StorageService.prototype.clear = function () {
        this.log.d('Clearing localStorage');
        this.storage.clear();
    };
    StorageService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [logger_service_1.LoggerService])
    ], StorageService);
    return StorageService;
}());
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map
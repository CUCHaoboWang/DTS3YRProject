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
exports.LoggerService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var LoggerService = /** @class */ (function () {
    function LoggerService() {
        this.log = window.console;
        this.LOG_FNS = [];
        this.MSG_PREFIXES = [
            ['[', ']'],
            ['[', '] WARN: '],
            ['[', '] ERROR: ']
        ];
        this.LOG_FNS = [this.log.log, this.log.warn, this.log.error];
    }
    LoggerService.prototype.get = function (prefix) {
        var _this = this;
        var prodMode = environment_1.environment.production;
        var loggerFns = this.LOG_FNS.map(function (logTemplFn, i) {
            return logTemplFn.bind(_this.log, _this.MSG_PREFIXES[i][0] + prefix + _this.MSG_PREFIXES[i][1]);
        });
        return {
            d: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!prodMode) {
                    loggerFns[0].apply(this.log, arguments);
                }
            },
            w: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!prodMode) {
                    loggerFns[1].apply(this.log, arguments);
                }
            },
            e: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!prodMode) {
                    loggerFns[2].apply(this.log, arguments);
                }
            }
        };
    };
    LoggerService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], LoggerService);
    return LoggerService;
}());
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map
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
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var utils_service_1 = require("../shared/services/utils/utils.service");
var unique_names_generator_1 = require("unique-names-generator");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(router, utilsSrv, formBuilder) {
        this.router = router;
        this.utilsSrv = utilsSrv;
        this.formBuilder = formBuilder;
        this.isExpanded = false;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.entryForm = new forms_1.FormGroup({
            userName: new forms_1.FormControl('', [forms_1.Validators.minLength(4), forms_1.Validators.required]),
            roomName: new forms_1.FormControl('', [forms_1.Validators.minLength(4), forms_1.Validators.required]),
            roomType: new forms_1.FormControl('', forms_1.Validators.required)
        });
    };
    HomeComponent.prototype.collapse = function () {
        this.isExpanded = false;
    };
    HomeComponent.prototype.toggle = function () {
        this.isExpanded = !this.isExpanded;
    };
    HomeComponent.prototype.generateRandomName = function () {
        var randomUserName = this.utilsSrv.generateNickname();
        var randomRoomName = unique_names_generator_1.uniqueNamesGenerator({ dictionaries: [unique_names_generator_1.adjectives, unique_names_generator_1.animals], separator: '-', });
        this.entryForm.controls['userName'].setValue(randomUserName);
        this.entryForm.controls['roomName'].setValue(randomRoomName);
    };
    HomeComponent.prototype.goToVideoCall = function () {
        this.entryForm.controls['roomType'].setValue('video-call');
        this.onSubmit();
    };
    HomeComponent.prototype.goToVideoStreaming = function () {
        this.entryForm.controls['roomType'].setValue('video-streaming');
        this.onSubmit();
    };
    HomeComponent.prototype.goToVideoConferencing = function () {
        this.entryForm.controls['roomType'].setValue('video-conferencing');
        this.onSubmit();
    };
    HomeComponent.prototype.onSubmit = function () {
        if (this.entryForm.valid) {
            var userName = this.entryForm.controls['userName'].value;
            var roomName = this.entryForm.controls['roomName'].value.replace(/ /g, '-'); // replace white spaces by -
            var roomType = this.entryForm.controls['roomType'].value;
            this.entryForm.controls['roomName'].setValue(roomName);
            this.router.navigate(['/' + roomType, userName, roomName]);
        }
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, utils_service_1.UtilsService, forms_1.FormBuilder])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map
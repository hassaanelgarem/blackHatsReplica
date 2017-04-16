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
const core_1 = require("@angular/core");
const businessPage_service_1 = require("./businessPage.service");
const router_1 = require("@angular/router");
const http_1 = require("@angular/http");
let BusinessPageComponent = class BusinessPageComponent {
    constructor(businessPageService, router, http) {
        this.businessPageService = businessPageService;
        this.router = router;
        this.http = http;
        this.businessId = "58ee4577fa669f51b6abf3ae";
        this.path = "http://localhost:8080/api/";
        this.loadDone = false;
    }
    ngOnInit() {
        this.businessPageService.getBusinessInfo(this.businessId).subscribe(info => {
            if (info.err) {
                console.error(info.msg);
            }
            else {
                console.log(info);
                this.business = info.data;
                this.name = info.data.name;
                this.address = info.data.address;
                this.phoneNumbers = info.data.phoneNumbers;
                this.totalRatings = info.data.totalRatings;
                this.loadDone = true;
            }
        });
        this.businessPageService.getActivities(this.businessId).subscribe(info => {
            if (info.err) {
                console.error(info.msg);
            }
            else {
                this.activities = info.data;
            }
        });
    }
};
BusinessPageComponent = __decorate([
    core_1.Component({
        selector: 'app-business-page',
        templateUrl: './businessPage.component.html'
    }),
    __metadata("design:paramtypes", [businessPage_service_1.BusinessPageService,
        router_1.Router,
        http_1.Http])
], BusinessPageComponent);
exports.BusinessPageComponent = BusinessPageComponent;

import { Component, OnInit } from '@angular/core';
import {BusinessPageService} from './businessPage.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Headers } from '@angular/http';


@Component({
    selector: 'app-business-page',
    templateUrl: './businessPage.component.html',
    styleUrls: ['./businessPage.component.css']
})
export class BusinessPageComponent implements OnInit {

    name: String = "";
    logo: String = "";
    address: String = "";
    addressAvailable = false;
    email: String = "";
    phoneNumbers: String[] = [];
    phoneNumbersAvailable = false;
    workingDays: String[] = [];
    workingDaysAvailable = false;
    workingFrom: String = "";
    workingTo: String = "";
    workingHoursAvailable = false;
    totalRatings: Number = 0;
    description: String = "";
    rating: any = "";
    ratingNumber: Number = 0;
    activities: Object[] = new Array<Object>();
    category: String;
    categoryAvailable = false;
    businessId: String = "";
    path: String = "http://localhost:8080/api/";
    reviews: Object[] = new Array<Object>();
    photos: String[] = [];
    firstPhoto: String = "";
    paymentRequired: Number;
    paymentStatus: String;
    deposit: Number;
    depositAvailable = false;
    loadDone = false;
    ownerLoggedIn = false;
    userLoggedIn = false;
    otherBusinessLoggedIn = false;
    noLogIn = false;

    constructor(
        private businessPageService: BusinessPageService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: Http) { }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.businessId = params['businessId'];




            this.businessPageService.getBusinessInfo(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    console.log(info);
                    this.name = info.data.name;
                    this.logo = info.data.logo;
                    if (info.data.address != null) {
                        this.address = info.data.address;
                        this.addressAvailable = true;
                    }
                    if (info.data.phoneNumbers.length != 0) {
                        this.phoneNumbers = info.data.phoneNumbers;
                        this.phoneNumbersAvailable = true;
                    }
                    this.totalRatings = info.data.totalRatings;
                    this.description = info.data.description;
                    if (info.data.workingDays.length != 0) {
                        this.workingDays = info.data.workingDays;
                        this.workingDaysAvailable = true;
                    }
                    this.email = info.data.email;
                    if (info.data.category != null) {
                        this.category = info.data.category;
                        this.categoryAvailable = true;
                    }
                    console.log("abl wh");
                    if (info.data.workingHours != null) {
                      console.log("working hours");
                        this.workingFrom = info.data.workingHours.from;
                        this.workingTo = info.data.workingHours.to;
                        this.workingHoursAvailable = true;
                    }
                    this.photos.length = info.data.photos.length - 1;
                    this.photos[0] = info.data.photos[1];
                    for(var _i = 1; _i < this.photos.length; _i++){
                      this.photos[_i] = info.data.photos[_i + 1];
                    }
                    this.firstPhoto = info.data.photos[0];
                    this.paymentRequired = info.data.paymentRequired;
                    if (info.data.deposit != null) {
                        this.deposit = info.data.deposit * 100;
                        this.depositAvailable = true;
                    }
                    switch (this.paymentRequired) {
                        case 1: this.paymentStatus = "Full payment needed in advance."; break;
                        case 2: this.paymentStatus = "A " + this.deposit + "% deposit needed in advance."; break;
                        case 3: this.paymentStatus = "No payment needed in advance."; break;
                        default: this.paymentStatus = "No payment needed in advance.";
                    }
                    this.loadDone = true;
                }
            });

            this.businessPageService.getAverageRating(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.rating = info.data.toFixed(1);
                    this.ratingNumber += this.rating;
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

            this.businessPageService.getReviews(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.reviews = info.data;
                }
            });

            this.businessPageService.updateInteractivity(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
            });
        });
    }

    addFavorite(){
      this.businessPageService.addFavorite(this.businessId).subscribe(info => {
            if (info.err) {
                console.error(info.msg);
            }
        });

      }
}

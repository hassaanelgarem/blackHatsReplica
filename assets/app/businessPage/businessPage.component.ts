import { Component, OnInit } from '@angular/core';
import {BusinessPageService} from './businessPage.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Headers } from '@angular/http';
import { AppService } from '../app.service';



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
    favorited = false;

    constructor(
        private businessPageService: BusinessPageService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: Http,
        private appService: AppService) { }

    ngOnInit() {
      this.initialize();

}
  initialize(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.businessId = params['businessId'];

            this.appService.getCurrentUser().subscribe(info => {
              if(info.success){
                if(info.user){
                  this.userLoggedIn = true;
                  this.ownerLoggedIn = false;
                  if(info.user.favorites.includes(this.businessId)){
                    this.favorited = true;
                    console.log("it's a favorite");
                  } else{
                    this.favorited = false;
                    console.log("it's not a favorite");
                  }
                } else if(info.business._id == this.businessId){
                    this.ownerLoggedIn = true;
                    this.userLoggedIn = false;
                    console.log("owner logged in");
                } else{
                    this.ownerLoggedIn = false;
                    this.userLoggedIn = false;
                    console.log("another business logged in");
                }
              } else{
                  this.ownerLoggedIn = false;
                  this.userLoggedIn = false;
                  console.log("no log in");
              }
            });

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
            },
            (err) => {
                switch (err.status) {
                    case 404:
                        console.log("404 not found");
                        break;
                    case 401:
                        console.log("Unauthorized");
                        break;
                    default:
                        console.log("Oops somethings went wrong");
                        break;
                }
            });

            this.businessPageService.getAverageRating(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    console.log("here yasta");
                    console.log(info);
                    this.rating = info.data.toFixed(1);
                    this.ratingNumber += this.rating;
                }
            },(err) => {
                switch (err.status) {
                    case 404:
                        console.log("404 not found");
                        break;
                    case 401:
                        console.log("Unauthorized");
                        break;
                    default:
                        console.log("Oops somethings went wrong");
                        break;
                }
            });

            this.businessPageService.getActivities(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.activities = info.data;
                }
            },(err) => {
                switch (err.status) {
                    case 404:
                        console.log("404 not found");
                        break;
                    case 401:
                        console.log("Unauthorized");
                        break;
                    default:
                        console.log("Oops somethings went wrong");
                        break;
                }
            });

            this.businessPageService.getReviews(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.reviews = info.data;
                }
            },(err) => {
                switch (err.status) {
                    case 404:
                        console.log("404 not found");
                        break;
                    case 401:
                        console.log("Unauthorized");
                        break;
                    default:
                        console.log("Oops somethings went wrong");
                        break;
                }
            });

            this.businessPageService.updateInteractivity(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
            },(err) => {
                switch (err.status) {
                    case 404:
                        console.log("404 not found");
                        break;
                    case 401:
                        console.log("Unauthorized");
                        break;
                    default:
                        console.log("Oops somethings went wrong");
                        break;
                }
            });
        },(err) => {
            switch (err.status) {
                case 404:
                    console.log("404 not found");
                    break;
                case 401:
                    console.log("Unauthorized");
                    break;
                default:
                    console.log("Oops somethings went wrong");
                    break;
            }
        });
    }

    addFavorite() {
        this.businessPageService.addFavorite(this.businessId).subscribe(
          (info) => {
          this.favorited = true;
          this.initialize();
        },(err) => {
            console.log(err);
            switch (err.status) {
                case 404:
                    console.log("404 not found");
                    break;
                case 401:
                    console.log("Unauthorized");
                    break;
                default:
                    console.log("Oops somethings went wrong in favoriting");
                    break;
            }
        });
    }
}

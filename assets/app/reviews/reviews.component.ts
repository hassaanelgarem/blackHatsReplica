import { Component, OnInit } from '@angular/core';
import {ReviewsService} from './reviews.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Review } from './reviews.model';
import { AppService } from '../app.service';


@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {

    rating: any = "";
    ratingNumber: Number = 0;
    businessId: String = "";
    userId: String = "";
    businessName: String = "";
    logo: String = "";
    businessAddress: String = "";
    addressAvailable = false;
    businessPhoneNumbers: String[] = [];
    phoneNumbersAvailable = false
    reviews: Object[] = new Array<Review>();
    firstPhoto: String;
    businessPhotos: String[] = [];
    path: String = "http://localhost:8080/api/";
    loadDone = false;

    addComment: String;
    addRating: Number;
    addCommentWarning = false;
    addRatingWarning = false;
    userLoggedIn = false;
    favorited = false;

    constructor(
        private reviewsService: ReviewsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: Http,
        private appService: AppService) { }

    ngOnInit() {
        this.initialize();
    }

    initialize() {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.businessId = params['businessId'];

            this.appService.getCurrentUser().subscribe(info => {
              if(info.success){
                if(info.user){
                  this.userLoggedIn = true;
                  this.userId = info.user._id;
                  if(info.user.favorites.includes(this.businessId)){
                    this.favorited = true;
                    console.log("it's a favorite");
                  } else{
                    this.favorited = false;
                    console.log("it's not a favorite");
                  }
                } else{
                    this.userLoggedIn = false;
                }
              } else{
                  this.userLoggedIn = false;
              }
            });


            this.reviewsService.getBusinessInfo(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    console.log(info);
                    this.businessName = info.data.name;
                    this.logo = info.data.logo;
                    if (info.data.address != null) {
                        this.businessAddress = info.data.address;
                        this.addressAvailable = true;
                    }
                    if (info.data.phoneNumbers.length != 0) {
                        this.businessPhoneNumbers = info.data.phoneNumbers;
                        this.phoneNumbersAvailable = true;
                    }
                    this.businessPhotos.length = info.data.photos.length - 1;
                    this.businessPhotos[0] = info.data.photos[1];
                    for (var _i = 1; _i < this.businessPhotos.length; _i++) {
                        this.businessPhotos[_i] = info.data.photos[_i + 1];
                    }
                    this.firstPhoto = info.data.photos[0];
                    this.loadDone = true;
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
                        console.log("Oops somethings went wrong in getting info");
                        break;
                }
            });

            this.reviewsService.getAverageRating(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
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

            this.reviewsService.getReviews(this.businessId).subscribe(info => {
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
        this.reviewsService.addFavorite(this.businessId).subscribe(
          (info) => {
          this.favorited = true;
          this.initialize();
        },(err) => {
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

    submitReview() {
        if (!this.addComment || this.addComment.length == 0) {
            this.addCommentWarning = true;
        }
        else {
            this.addCommentWarning = false;
        }
        if (!this.addRating || this.addRating == 0) {
            this.addRatingWarning = true;
        }
        else {
            this.addRatingWarning = false;
        }


        if (!this.addCommentWarning && !this.addRatingWarning) {
            const newReview = new Review(this.addComment, this.addRating, this.businessId, this.userId);
            this.reviewsService.addReview(newReview).subscribe((info) => {
                if (info.err) {
                    console.error(info.msg);
                } else {
                    this.reviews.push(new Review(info.data.comment, info.data.rating, info.data.business, info.data.user, info.data.time));
                    this.addComment = null;
                    this.addRating = null;
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

        } else {
            //error message
        }

    }

    hideCommentWarning() {
        this.addCommentWarning = false;
    }

    hideRatingWarning() {
        this.addRatingWarning = false;
    }


}

import { Component, OnInit } from '@angular/core';
import {ReviewsService} from './reviews.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Review } from './reviews.model';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {

    rating: any = "";
    ratingNumber: Number = 0;
    businessId: String = "";
    userId: String = "58f2930eb12e4f01d02fd302";
    businessName: String = "";
    logo: String = "";
    businessAddress: String = "";
    addressAvailable = false;
    businessPhoneNumbers: String[] = [];
    phoneNumbersAvailable = false
    totalRatings: Number = 0;
    reviews: Object[] = new Array<Review>();
    firstPhoto: String;
    businessPhotos: String[] = [];
    path: String = "http://localhost:8080/api/";
    loadDone = false;

    availableRatings = [0, 1, 2, 3, 4, 5];
    addComment: String;
    addRating: Number;
    addCommentWarning = false;
    addRatingWarning = false;

    constructor(
        private reviewsService: ReviewsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: Http) { }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.businessId = params['businessId'];

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
                    this.totalRatings = info.data.totalRatings;
                    this.businessPhotos.length = info.data.photos.length - 1;
                    this.businessPhotos[0] = info.data.photos[1];
                    for (var _i = 1; _i < this.businessPhotos.length; _i++) {
                        this.businessPhotos[_i] = info.data.photos[_i + 1];
                    }
                    this.firstPhoto = info.data.photos[0];
                    this.loadDone = true;
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
            });

            this.reviewsService.getReviews(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.reviews = info.data;
                }
            });

        });
    }

    addFavorite() {
        this.reviewsService.addFavorite(this.businessId).subscribe(info => {
            if (info.err) {
                console.error(info.msg);
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
          console.log("warnings tamam");
            const newReview = new Review(this.addComment, this.addRating, this.businessId, this.userId);
            this.reviewsService.addReview(newReview).subscribe((info) => {
              console.log("da5al el callback");
                if (info.err) {
                    console.error(info.msg);
                } else {
                  console.log("el mafrood tamam");
                    this.reviews.push(new Review(info.data.comment, info.data.rating, info.data.business, info.data.user, info.data.time), callback => {
                        this.initialize();
                    });
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

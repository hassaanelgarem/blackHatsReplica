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
    firstName: String;
    lastName: String;
    user: any;

    addComment: String;
    addRating: Number;
    addCommentWarning = false;
    addRatingWarning = false;
    userLoggedIn = false;
    favorited = false;
    noPhotos = false;

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
                if (info.success) {
                    if (info.user) {
                        this.userLoggedIn = true;
                        this.userId = info.user._id;
                        this.user = info.user;
                        if (info.user.favorites.includes(this.businessId)) {
                            this.favorited = true;
                            console.log("it's a favorite");
                        } else {
                            this.favorited = false;
                            console.log("it's not a favorite");
                        }
                    } else {
                        this.userLoggedIn = false;
                    }
                } else {
                    this.userLoggedIn = false;
                }
            });


            this.reviewsService.getBusinessInfo(this.businessId).subscribe(
                (info) => {
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
                    if (info.data.photos.length != 0) {
                        console.log("photos");
                        this.businessPhotos.length = info.data.photos.length - 1;
                        this.businessPhotos[0] = info.data.photos[1];
                        for (var _i = 1; _i < this.businessPhotos.length; _i++) {
                            this.businessPhotos[_i] = info.data.photos[_i + 1];
                        }
                        this.firstPhoto = info.data.photos[0];
                        this.noPhotos = false;
                    } else {
                        console.log("no photo");
                        this.noPhotos = true;
                    }
                    this.loadDone = true;
                    if (info.err) {
                        console.error(info.msg);
                    }
                }, (err) => {
                    switch (err.status) {
                        case 404:
                            this.router.navigateByUrl('/404-error');
                            break;
                        case 401:
                            this.router.navigateByUrl('/notAuthorized-error');
                            break;
                        default:
                            this.router.navigateByUrl('/500-error');
                            break;
                    }
                });

            this.reviewsService.getAverageRating(this.businessId).subscribe(
                (info) => {
                    this.rating = info.data.toFixed(1);
                    this.ratingNumber += this.rating;
                }, (err) => {
                    switch (err.status) {
                        case 404:
                            this.router.navigateByUrl('/404-error');
                            break;
                        case 401:
                            this.router.navigateByUrl('/notAuthorized-error');
                            break;
                        default:
                            this.router.navigateByUrl('/500-error');
                            break;
                    }
                });

            this.reviewsService.getReviews(this.businessId).subscribe(
                (info) => {
                    this.reviews = info.data;
                }, (err) => {
                    switch (err.status) {
                        case 404:
                            this.router.navigateByUrl('/404-error');
                            break;
                        case 401:
                            this.router.navigateByUrl('/notAuthorized-error');
                            break;
                        default:
                            this.router.navigateByUrl('/500-error');
                            break;
                    }
                });
        }, (err) => {
            switch (err.status) {
                case 404:
                    this.router.navigateByUrl('/404-error');
                    break;
                case 401:
                    this.router.navigateByUrl('/notAuthorized-error');
                    break;
                default:
                    this.router.navigateByUrl('/500-error');
                    break;
            }
        });
    }

    addFavorite() {
        this.reviewsService.addFavorite(this.businessId).subscribe(
            (info) => {
                this.favorited = true;
                this.initialize();
            }, (err) => {
                switch (err.status) {
                    case 404:
                        this.router.navigateByUrl('/404-error');
                        break;
                    case 401:
                        this.router.navigateByUrl('/notAuthorized-error');
                        break;
                    default:
                        this.router.navigateByUrl('/500-error');
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
            const newReview = new Review(this.addComment, this.addRating, this.businessId, { "firstName": this.user.firstName, "lastName": this.user.lastName, "_id": this.userId });
            this.reviewsService.addReview(newReview).subscribe((info) => {
                this.reviews.push(new Review(info.data.comment, info.data.rating, info.data.business, { "firstName": this.user.firstName, "lastName": this.user.lastName, "_id": info.data.user }, info.data.time));
                this.addComment = null;
                this.addRating = null;
            }, (err) => {
                switch (err.status) {
                    case 404:
                        this.router.navigateByUrl('/404-error');
                        break;
                    case 401:
                        this.router.navigateByUrl('/notAuthorized-error');
                        break;
                    default:
                        this.router.navigateByUrl('/500-error');
                        break;
                }
            });

         }
         // else {
             //error message
        // }

    }

    hideCommentWarning() {
        this.addCommentWarning = false;
    }

    hideRatingWarning() {
        this.addRatingWarning = false;
    }


}

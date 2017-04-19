import { Component, OnInit } from '@angular/core';
import {ReviewsService} from './reviews.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {

  rating: any = "";
  ratingNumber: Number = 0;
  businessId: String = "";
  businessName: String = "";
  logo: String = "";
  businessAddress: String = "";
  addressAvailable = false;
  businessPhoneNumbers: String[] = [];
  phoneNumbersAvailable = false
  totalRatings: Number = 0;
  reviews: Object[] = new Array<Object>();
  businessPhotos: String[] = [];
  path: String = "http://localhost:8080/api/";
  loadDone = false;

  config: Object = {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      spaceBetween: 30
  }

  constructor(
    private reviewsService: ReviewsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: Http) { }

  ngOnInit() {
    this.initialize();
    }

    initialize(){
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
                  this.businessPhotos = info.data.photos;
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

    addFavorite(){
      this.reviewsService.addFavorite(this.businessId).subscribe(info => {
            if (info.err) {
                console.error(info.msg);
            }
        });
      }

      submitReview(comment,rating){
          if(comment.length < 201){
            this.reviewsService.addReview(comment, rating, this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
            });
            this.initialize();
        } else{
          //error message
        }
    }



  }

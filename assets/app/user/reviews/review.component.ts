
import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'user-review',
    templateUrl: './review.component.html',

})

export class ReviewComponent implements OnInit {
    count: Number = 0;
    reviews: Object[];
    //reviews: Review[];
    userId: String = "58f252bd9037f62725ddf62c";
    averageString: String;
    loggedIn = true;
    editDone = false;

    // Edit attributes

    reviewId: String;
    editComment: String;
    editRating: Number;

    // warning flags

    editCommentWarning = false;
    editRatingWarning = false;

    constructor(
        private userService: UserService,
        private router: Router,
        private http: Http) { }

    //hassaan:
    ngOnInit() {
        /*this.businessService.getAverageRating(this.businessId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
                this.averageString = data.data.toFixed(1);
            }
        });
        */

        this.userService.getReviews(this.userId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
              this.reviews = data.data;
              this.count = this.reviews.length;
            }
        });
    }


    onDelete(i){
      this.userService.deleteReview(this.reviews[i]._id).subscribe(
        (data) => {
          console.log("no error");
          this.reviews.splice(i, 1);
        },
        (err) => {
          console.error("error!");
        }
       );
    }


    onEdit(i){
      this.router.navigate(["/user/review/" + this.reviews[i]._id]);
  }

    onSave(i){
      if (!this.editComment || this.editComment.length == 0) {
          this.editCommentWarning = true;
      }
      else {
          this.editCommentWarning = false;
      }
      if (!this.editRating || this.editRating == 0) {
          this.editRatingWarning = true;
      }
      else {
          this.editRatingWarning = false;
      }
      if (!this.editCommentWarning && !this.editRatingWarning) {

          this.editComment = null;
          this.editRating = null;

          this.userService.editReview(this.reviews[i]._id).subscribe(
              (data) => {
                console.log("no error!");
                this.editDone = true;
              },
              (err) => {
                  console.log(err);
              }

          );

    }
    }

    onCancel(){
      this.reviewId = null;
      this.editComment = null;
      this.editRating = null;
      this.editDone = false;
    }

    hideEditCommentWarning() {
        this.editCommentWarning = false;
    }

    hideEditRatingWarning() {
        this.editRatingWarning = false;
      }

}

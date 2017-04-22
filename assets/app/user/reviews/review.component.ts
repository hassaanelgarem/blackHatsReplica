
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
    userId: String = "58e8d26b86e48c253b2c3c1e";
    averageString: String;
    loggedIn = true;
    editing: Boolean[] = [];
    editIndex = 0;
    editComment: String;
    editRating: Number;


    constructor(
        private userService: UserService,
        private router: Router,
        private http: Http) { }

    //hassaan:
    ngOnInit() {

        this.userService.getReviews(this.userId).subscribe(
          (data) => {
            this.reviews = data.data;
            this.count = this.reviews.length;
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

    onDelete(i){
      this.editIndex = i;
      this.userService.deleteReview(this.reviews[i]._id).subscribe(
        (data) => {
        this.reviews.splice(i,1);
      },
      (err) => {
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
      this.editing[i] = false;
    }

    onSave(i){
      this.editIndex = i;
      this.userService.editReview(this.reviews[i]._id, this.editComment, this.editRating).subscribe(
        (data) => {
          this.reviews[i].comment = this.editComment;
          this.reviews[i].rating = this.editRating;
          this.editing[i] = false;
          this.editComment = null;
          this.editRating = null;
        },
        (err) => {
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

    onCancel(i){
      this.editIndex = i;
      this.editing[i] = false;
    }

    onEdit(i){
      for(var j = 0; j < this.editing.length; j++ ){
        this.editing[j] = false;
      }
      this.editing[i] = true;
      this.editComment = this.reviews[i].comment;
      this.editRating = this.reviews[i].rating;
    }



}

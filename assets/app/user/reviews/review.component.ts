import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from "../user.service";
import { AppService } from '../../app.service';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import{UserComponent} from "../user.component";


@Component({
    selector: 'user-review',
    templateUrl: './review.component.html',

})

export class ReviewComponent implements OnInit {

    count: Number = 0;
    reviews: Object[];
    //reviews: Review[];
    userId: String = "";//"58e8d26b86e48c253b2c3c1e";
    averageString: String;
    loggedIn:Boolean;
    editing: Boolean[] = [];
    editIndex = 0;
    editComment: String;
    editRating: Number;


    constructor(
        private activatedRoute: ActivatedRoute,
        private userComponent: UserComponent,
        private appService: AppService,
        private userService: UserService,
        private router: Router,
        private http: Http) { }

    //hassaan:
    ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.userId = params['userId'];
        this.appService.getCurrentUser().subscribe(data => {
            if (data.success) {
                if (data.user) {
                    this.isUser = true;
                    if(this.userId == data.user._id){
                      this.loggedIn = true;
                    }
                    else{
                      this.loggedIn = false;
                    }
                }
                else {
                    this.loggedIn = false;
                }
            }
            else {
                this.loggedin = false;
            }
            this.userService.getReviews(this.userId).subscribe(data => {
                if (data.err) {
                    console.error(data.msg);
                }
                else {
                  this.reviews = data.data;
                  this.count = this.reviews.length;
                }
            });
        });

      });


    }

    onDelete(i){
      this.editIndex = i;
      this.userService.deleteReview(this.reviews[i]._id).subscribe(
        (data) => {
        console.log("no error");
        this.reviews.splice(i,1);
      },
      (err) => {
      console.log("error");
      });
      this.editing[i] = false;
    }

    onSave(i){
      this.editIndex = i;
      this.userService.editReview(this.reviews[i]._id, this.editComment, this.editRating).subscribe(
        (data) => {
          console.log("no error");
          this.reviews[i].comment = this.editComment;
          this.reviews[i].rating = this.editRating;
          this.editing[i] = false;
          this.editComment = null;
          this.editRating = null;
        },
        (err) => {
          console.log("error");
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

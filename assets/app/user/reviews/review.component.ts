
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


    onDeleteClick(){

    }


    onEditClick(){

    }
}

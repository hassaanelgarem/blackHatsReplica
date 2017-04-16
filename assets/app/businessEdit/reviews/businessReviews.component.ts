import { Component, OnInit } from '@angular/core';
import {BusinessService} from '../business.service';
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'app-business-reviews',
    templateUrl: './businessReviews.component.html'
  })
export class BusinessReviewsComponent implements OnInit {
    count: Number = 15;
    reviews: [Object];
    businessId: String = "58ed7913b3f3c31400258d66";
    averageString: String;

    constructor(
        private businessService: BusinessService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
        this.businessService.getAverageRating(this.businessId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
                this.averageString = data.data.toFixed(1);
            }
        });

        this.businessService.getReviews(this.businessId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
              this.reviews = data.data;
              this.count = this.reviews.length;
            }
        });
    }
}

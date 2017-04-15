import { Component, OnInit } from "@angular/core";

import { Review } from "./review.model";
import { ReviewService } from "./review.service";

@Component({
    selector: 'user-review-list',
    template: `
        <div class="col-md-8 col-md-offset-2">
            <user-review
                   [review]="review"
                    *ngFor="let review of reviews"></user-review>
        </div>
    `
})
export class ReviewListComponent implements OnInit {
    reviews: Review[];

    constructor(private reviewService: ReviewService) {}

    ngOnInit() {
        this.reviewService.getReviews()
        //we need to subscribe to the reviewservice:
            .subscribe(
                (reviews: Review[]) => {
                    this.reviews = reviews;
                }
            );
    }
}
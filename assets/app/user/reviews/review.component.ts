import { Component, Input } from "@angular/core";

import { Review } from "./review.model";
import { ReviewService } from "./review.service";

@Component({
    selector: 'user-review',
    templateUrl: './review.component.html',
    
})
export class ReviewComponent {
    @Input() review: Review;

    constructor(private reviewService: ReviewService) {}

    /*onEdit() {
        this.reviewService.editReview(this.review);
    }

    onDelete() {
        this.reviewService.deleteReview(this.review)
            .subscribe(
                result => console.log(result)
            );
    }
    */
}
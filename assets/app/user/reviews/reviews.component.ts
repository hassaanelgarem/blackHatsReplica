import { Component } from "@angular/core";

@Component({
    selector: 'user-reviews',
    template: `
        <hr>
        <div class="row">
            <user-review-list></user-review-list>
        </div>
    `
})
export class ReviewsComponent {

}
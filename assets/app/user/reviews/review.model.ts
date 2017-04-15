export class Review {
    comment: string;
    //username: string;
    rating:Number;
    reviewId?:string;
    time?:Date;
    businessId?:string;
    userId?: string;

    constructor(comment: string, rating: Number, reviewId?:string, time?:Date,businessId?: string,  userId?:string) {
        this.comment = comment;
        this.rating = rating;
        this.reviewId = reviewId;
        this.businessId = businessId;
        this.time = time;
        this.userId = userId;
    }
}
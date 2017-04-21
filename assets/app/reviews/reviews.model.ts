//Create a Class for the review created in the Component to be passed back to the backend
export class Review {

  comment: String;
  rating: Number;
  business: String;
  user: String;
  time: Date;

    constructor(comment: String,
        rating: Number,
        business: String,
        user: String,
        time?: Date
          ) {
          this.comment = comment;
          this.rating = rating;
          this.business = business;
          this.user = user;
          this.time = time;
        }
}

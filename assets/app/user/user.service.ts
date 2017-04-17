import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

//import { Review } from "./reviews/review.model";

@Injectable()
export class UserService {
    private reviews: Object[] = [];
    private user:Object;
    private business:Object;
    //reviewIsEdit = new EventEmitter<Review>();
    private loggedin = true;
    //private user:User;

    // change loggedIn to a subject
    //private loggedIn: Subject<boolean> = new Subject<boolean>();

    // make isLoggedIn public readonly
    /*get isLoggedIn() {
        return this.loggedIn.asObservable();
    }*/

    constructor(private http: Http) {
      //this.loggedIn.next(!!localStorage.getItem('authToken'));
    }

//fixed:

//hassaan's:
    getAverageRating(businessId) {
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/review/averageRating/' + businessId, {headers: headers}).map(res => res.json());
  }
  
  //get the user's reviews:
  getReviews(userId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/review/user/' + userId, {headers: headers}).map(res => res.json());
  }

  //get the user's info:
  getOneUser(userId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/user/profile/' + userId, {headers: headers}).map(res => res.json());
  }


  getCurrentInfo(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/business/' + businessId + '/getInfo', {headers: headers}).map(res => res.json());
  }


  getBookingHistory(userId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/booking/history/' + userId, {headers: headers}).map(res => res.json());
  }

  
//getFavorites:
  /*getFavorites(userId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/review/user/' + userId, {headers: headers}).map(res => res.json());
  }*/


//mirna's
    /*getReviews() {
        return this.http.get('http://localhost:8080/api/review/user/:userId')
        //to tranform the response
            .map((response: Response) => {
                const reviews = response.json().data;  //the data of the json object returned by the backend
                //the problem is the reviews have different fields than the ones in the backend, 
                //so we need to transform it:
                let transformedReviews: Review[] = [];
                //looping through the reviews i have from the backend
                for (let review of reviews) {
                    transformedReviews.push(new Review(review.comment, review.rating, review._id, review.time,review.business, review.user));
                }
                this.reviews = transformedReviews;
                return transformedReviews;
            })
            //to handle any possible errors:
            .catch((error: Response) => Observable.throw(error.json()));
    }*/


    /*editReview(review: Review) {
        this.reviewIsEdit.emit(review);
    }

    updateReview(review: Review) {
        //create a body which contains the review
        const body = JSON.stringify(review);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.patch('http://localhost:8080/api/review/'+review.reviewId+'/edit' , body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }


    deleteReview(review: Review) {
        this.reviews.splice(this.reviews.indexOf(review), 1);
        return this.http.delete('http://localhost:8080/api/review/' + review.reviewId+ '/delete')
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    */


  
}

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

  deleteFavorite(businessId) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.delete('http://localhost:8080/api/user/deleteFavorite/' + businessId, {headers: headers}).map(res => res.json());
      
    }
  

}

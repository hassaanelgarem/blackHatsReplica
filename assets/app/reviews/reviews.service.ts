import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Review } from './reviews.model';


@Injectable()
export class ReviewsService {

  constructor(private http: Http) { }

  getBusinessInfo(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/business/' + businessId + '/getInfo', {headers: headers}).map(res => res.json());
  }

  getReviews(businessId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/review/' + businessId, {headers: headers}).map(res => res.json());
  }

  getAverageRating(businessId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/review/averageRating/' + businessId, {headers: headers}).map(res => res.json());
  }

  addFavorite(businessId){
    return this.http.put('http://54.213.175.206:8080/api/user/addFavorite/' + businessId, null, null).map(res => res.json());
  }

  addReview(review: Review){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify(review);
    let businessId = review.business;
    return this.http.post('http://54.213.175.206:8080/api/review/' + businessId + '/add', body, {headers: headers}).map(res => res.json());
  }

}

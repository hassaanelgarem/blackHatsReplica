import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class BusinessService {

  constructor(private http: Http) { }

  getAverageRating(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/review/averageRating/' + businessId, {headers: headers}).map(res => res.json());
  }

  getReviews(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/review/' + businessId, {headers: headers}).map(res => res.json());
  }

}

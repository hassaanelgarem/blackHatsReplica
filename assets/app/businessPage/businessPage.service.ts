import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class BusinessPageService {

  constructor(private http: Http) { }

  getBusinessInfo(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080//api/business/' + businessId + '/getInfo', {headers: headers}).map(res => res.json());
  }

  getReviews(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/review/' + businessId, {headers: headers}).map(res => res.json());
  }

  getActivities(businessId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/activity/' + businessId, {headers: headers}).map(res => res.json());
  }

  getAverageRating(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/review/averageRating/' + businessId, {headers: headers}).map(res => res.json());
  }
  
}

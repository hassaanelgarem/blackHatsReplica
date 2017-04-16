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

  testUserLogin(){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let body = {
      "username": "aya",
      "password": "aya"
    };
    return this.http.post('http://localhost:8080/api/user/login', body, {headers: headers}).map(res => res.json());
  }

  testBusinessLogin(){
    console.log("testBusinessLogin");
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let body = {
      "email": "five@gmail.com",
	    "password": "pass"
    };
    return this.http.post('http://localhost:8080/api/business/login', body, {headers: headers}).map(res => res.json());
  }

}

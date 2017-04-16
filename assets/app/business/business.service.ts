import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BusinessService {
  apiPath: String = "http://localhost:8080/api/";
  constructor(private http: Http) { }

  charge(token){
    let headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    let body = {
	      stripeToken: token
	    };
	    return this.http.post(this.apiPath + "charge", body, {headers: headers}).map(res => res.json());
  }

}

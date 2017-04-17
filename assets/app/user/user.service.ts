import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getBookingHistory(userId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/booking/history/' + userId, {headers: headers}).map(res => res.json());
  }

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

}

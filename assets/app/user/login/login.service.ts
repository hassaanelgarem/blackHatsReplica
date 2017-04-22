import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  userLogin(username, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      username: username,
      password: password
    }
    return this.http.post('http://localhost:8080/api/user/login', body, { headers: headers }).map(res => res.json());
  }


  businessLogin(email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      email: email,
      password: password
    }
    return this.http.post('http://localhost:8080/api/business/login', body, { headers: headers }).map(res => res.json());
  }


  forgetPassword(email) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      email: email
    }
    return this.http.post('http://localhost:8080/api/forgotPassword', body, { headers: headers }).map(res => res.json());
  }


  logout() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/logout', { headers: headers }).map(res => res.json());
  }

}

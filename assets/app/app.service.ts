import { Injectable } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';

@Injectable()
export class AppService {
  private isLoggedin = false;
  apiPath: String = "http://54.213.175.206:8080/api/";
  
  constructor(private http: Http) { }

  // to do from the database
  login(){

      //should add here the linking to backend function

      this.isLoggedin=true;
      return this.isLoggedin;
  }

  logout(){

      //should add here the linking to backend function

      this.isLoggedin=false;
      return this.isLoggedin;
  }

  status(){
      return this.isLoggedin;
  }

  getCurrentUser() {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.get('http://54.213.175.206:8080/api/currentUser', { headers: headers }).map(res => res.json());
  }

  charge(token){
    let headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    let body = {
	      stripeToken: token
	    };
	    return this.http.post(this.apiPath + "charge", body, {headers: headers}).map(res => res.json());
  }

}

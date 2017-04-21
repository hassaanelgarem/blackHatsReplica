import { Injectable } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';

@Injectable()
export class AppService {
  private isLoggedin = false;

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
      return this.http.get('http://localhost:8080/api/currentUser', { headers: headers }).map(res => res.json());
  }

}

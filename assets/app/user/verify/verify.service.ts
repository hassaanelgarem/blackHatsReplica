import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VerifyService {

  constructor(private http: Http) { }


  verifyToken(token){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
    return this.http.get('http://54.213.175.206:8080/api/user/verifyAccount/' + token, {headers: headers}).map(res => res.json());
  }


  confirmId(userId){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

    return this.http.post('http://54.213.175.206:8080/api/user/verifyAccount/' + userId, {headers: headers}).map(res => {return res.json().data}); 
  }
    
}

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ResetPasswordService {

  constructor(private http: Http) { }


  passwordToken(token){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
    return this.http.get('http://54.213.175.206:8080/api/resetPassword/' + token, {headers: headers}).map(res => res.json());
  }


  passwordId(id, password, confirmPassword){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
          password: password,
          confirmPassword: confirmPassword
        }
    return this.http.put('http://54.213.175.206:8080/api/resetPassword/' + id, body, {headers: headers}).map(res => {return res.json().data}); 
  }
    
}


import { Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EditProfileService {
    
    userId: String = "58f923c4fae7424824625eec";
    
    constructor(private http: Http) { }

    getOneUser(userId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/user/profile/' + userId, {headers: headers}).map(res => res.json());
  }

    editUserProfile(firstName, lastName, birthDate) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
          
        }
        return this.http.put('http://localhost:8080/api/user/profile/editInfo', body, { headers: headers }).map(res => res.json());
    }

    deleteAccount(){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.delete('http://localhost:8080/api/user/deleteAccount', {headers: headers}).map(res => res.json());
    }
}
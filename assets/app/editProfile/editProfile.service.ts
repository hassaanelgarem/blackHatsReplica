import { Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EditProfileService {
  businessId: String = "58e8d68ce4a2cf7c06cff89a";

  constructor(private http: Http) { }

getBusinessProfile(businessId){
  let headers = new Headers();
              headers.append('Content-Type', 'application/json');
  return this.http.get('http://localhost:8080/api/business/' + businessId + '/getInfo', {headers: headers}).map(res => res.json());
}

editBusinessProfile(business){
  let headers = new Headers();
              headers.append('Content-Type', 'application/json');
  return this.http.put('http://localhost:8080/api/business/editInfo', business, {headers: headers}).map(res => res.json());
}
}

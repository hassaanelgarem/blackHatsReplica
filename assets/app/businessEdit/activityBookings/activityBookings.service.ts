import { Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ActivityBookingsService {

  constructor(private http: Http) { }

  getBookings(businessId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/activity/getActivity/' + businessId, { headers: headers }).map(res => res.json());
  }
}

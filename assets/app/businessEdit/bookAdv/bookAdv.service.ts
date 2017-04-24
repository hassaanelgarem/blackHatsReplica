import { Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BookAdvService {

  constructor(private http: Http) { }

  getAdvSlots(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/advertisement/getAdvSlots', { headers: headers }).map(res => res.json());
  }

  getFreeSlot(advId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/advertisement/getFreeSlot/' + advId, { headers: headers }).map(res => res.json());
  }

  bookAdvSlot(startTime: Date, endTime: Date, advImg, advId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      "startTime": startTime.toString(),
      "endTime": endTime.toString(),
      "image": advImg
    };
    return this.http.post('http://54.213.175.206:8080/api/advertisement/bookAdvSlot/' + advId, body, {headers: headers}).map(res => res.json());
  }


}

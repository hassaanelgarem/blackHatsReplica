import { Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BookAdvService {

  constructor(private http: Http) { }

  getAdvSlots(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/advertisement/getAdvSlots', { headers: headers }).map(res => res.json());
  }

  getFreeSlot(advId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/advertisement/getFreeSlot/' + advId, { headers: headers }).map(res => res.json());
  }

  bookAdvSlot(startTime: Date, endTime: Date, advImg, advId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("Service");
    console.log(startTime);
    console.log(endTime);
    console.log("why does adv image change here");
    console.log(advImg);
    let body = {
      "startTime": startTime.toString(),
      "endTime": endTime.toString(),
      "image": advImg
    };
    return this.http.post('http://localhost:8080/api/advertisement/bookAdvSlot/' + advId, body, {headers: headers}).map(res => res.json());
  }


}

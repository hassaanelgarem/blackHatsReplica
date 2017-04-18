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


}

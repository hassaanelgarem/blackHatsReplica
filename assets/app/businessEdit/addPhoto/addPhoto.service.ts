import { Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AddPhotoService {

  constructor(private http: Http) { }

  deletePhoto(photoName){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete('http://54.213.175.206:8080/api/business/deletePhoto/' + photoName, { headers: headers }).map(res => res.json());
  }
}

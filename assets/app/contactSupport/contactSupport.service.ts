import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class ContactSupportService {

  apiPath: String = "http://54.213.175.206:8080/api/";

  constructor(private http: Http) { }

  submitRequest(title: string, contactEmail: string, contactPhoneNumber, accountType: string, registeredEmail: string, description: string) {
    return this.http.post(this.apiPath + 'contactSupport', {
      title,
      contactEmail,
      accountType,
      contactPhoneNumber,
      registeredEmail,
      description
    })
      //map method to transform the response
      .map(res => res.json());
  }
}

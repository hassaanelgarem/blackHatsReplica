import { Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EditProfileService {
    businessId: String;

    constructor(private http: Http) { }

    getBusinessProfile(businessId) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/business/' + businessId + '/getInfo', { headers: headers }).map(res => res.json());
    }

    editBusinessProfile(name, wHours, wDays, category, location, description, phoneNumbers, tags, paymentRequired, deposit) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
          name: name,
          description: description,
          tags: tags,
          category: category,
          paymentRequired: paymentRequired,
          phoneNumbers: phoneNumbers,
          workingDays: wDays,
          workingHours: wHours,
          location: location
        }
        return this.http.put('http://localhost:8080/api/business/editInfo', body, { headers: headers }).map(res => res.json());
    }
}

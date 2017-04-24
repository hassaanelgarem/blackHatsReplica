import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Slot } from '../businessEdit/activities/slot.model';
import 'rxjs/add/operator/map';


@Injectable()
export class BusinessPageService {

  constructor(private http: Http) { }

  getBusinessInfo(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/business/' + businessId + '/getInfo', {headers: headers}).map(res => res.json());
  }

  getReviews(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/review/' + businessId, {headers: headers}).map(res => res.json());
  }

  getActivities(businessId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/activity/' + businessId, {headers: headers}).map(res => res.json());
  }

  getAverageRating(businessId){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    return this.http.get('http://54.213.175.206:8080/api/review/averageRating/' + businessId, {headers: headers}).map(res => res.json());
  }

  updateInteractivity(businessId){
    return this.http.put('http://54.213.175.206:8080/api/business/' + businessId + '/interact', null, null).map(res => res.json());
  }

  addFavorite(businessId){
    return this.http.put('http://54.213.175.206:8080/api/user/addFavorite/' + businessId, null, null).map(res => res.json());
  }

  getAvailableSlots(activityId, date){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let body = {
      "date": date,
      "activityID": activityId
    }
    return this.http.post('http://54.213.175.206:8080/api/activity/freeSlots', body, {headers: headers}).map(res => res.json());
  }

  bookActivity(slot: Slot, activityId, date){
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let body = {
      "date": date,
      "activity": activityId,
      "slot": slot
    }
    return this.http.post('http://54.213.175.206:8080/api/activity/book', body, {headers: headers}).map(res => res.json());
  }

}

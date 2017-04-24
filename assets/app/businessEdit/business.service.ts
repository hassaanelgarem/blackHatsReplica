import { Injectable } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Activity } from './activities/activity.model';
import { Slot } from './activities/slot.model';
import 'rxjs/add/operator/map';


@Injectable()
export class BusinessService {

    constructor(private http: Http) { }

    getCurrentUser() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/currentUser', { headers: headers }).map(res => res.json());
    }

    getAverageRating(businessId) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/review/averageRating/' + businessId, { headers: headers }).map(res => res.json());
    }

    getReviews(businessId) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/review/' + businessId, { headers: headers }).map(res => res.json());
    }

    getActivity(activityId) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/activity/' + activityId + '/getActivity', { headers: headers }).map(res => res.json());

    }

    getActivities(businessId) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/activity/' + businessId, { headers: headers })
            .map((response: Response) => {
                const acts = response.json().data;
                let transformedActs: Activity[] = [];
                for (let act of acts) {
                    let slots: Slot[] = [];
                    for (let slot of act.slots) {
                        slots.push(new Slot(
                            slot.startTime,
                            slot.endTime
                        ));
                    }
                    transformedActs.push(new Activity(
                        act.name,
                        act.price,
                        act.description,
                        act.bookingsPerSlot,
                        act.business,
                        act.photos,
                        slots,
                        act.bookings,
                        act._id
                    )
                    );
                }
                return transformedActs;
            }
            );
    }

    deleteActivity(activity: Activity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.delete('http://localhost:8080/api/activity/' + activity.id + "/delete", { headers: headers }).map(res => res.json());
    }

    editActivity(activity: Activity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
            "name": activity.name,
            "price": activity.price,
            "description": activity.description,
            "bookingsPerSlot": activity.bookingsPerSlot
        };
        return this.http.post('http://localhost:8080/api/activity/' + activity.id + "/edit", body, {headers: headers }).map(res => res.json());
    }

    deleteSlot(slot: Slot, activity: Activity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
            "startTime": slot.startTime,
            "endTime": slot.endTime
        }
        return this.http.delete('http://localhost:8080/api/activity/' + activity.id + "/deleteSlot", { body: body, headers: headers }).map(res => res.json());
    }

    addSlot(slot: Slot, activity: Activity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
            "startTime": slot.startTime,
            "endTime": slot.endTime
        }
        return this.http.post('http://localhost:8080/api/activity/' + activity.id + "/addSlot", body, { headers: headers }).map(res => res.json());
    }

    deleteActivityPhoto(path, activity: Activity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.delete('http://localhost:8080/api/activity/' + activity.id + '/deletePhoto/' + path, { headers: headers }).map(res => res.json());
    }

    addActivity(activity: Activity) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const body = JSON.stringify(activity);
        return this.http.post('http://localhost:8080/api/activity/add', body, { headers: headers }).map(res => res.json());

    }


    testUserLogin() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
            "username": "aya",
            "password": "aya"
        };
        return this.http.post('http://localhost:8080/api/user/login', body, { headers: headers }).map(res => res.json());
    }

    testBusinessLogin() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
            "email": "five@gmail.com",
            "password": "pass"
        };
        return this.http.post('http://localhost:8080/api/business/login', body, { headers: headers }).map(res => res.json());
    }

}

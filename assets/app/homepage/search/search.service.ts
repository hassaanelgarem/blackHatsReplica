import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Business } from '../business.model';


@Injectable()
export class SearchService {
    private path: string = "http://localhost:8080/api/";
    private businesses: Business[] = [];

    constructor(private http: Http) { }

    getBusinesses(search: string) {
        return this.http.get(this.path + 'search?' + search)
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusiness: Business[] = [];
                for (let business of businesses) {
                    transformedBusiness.push(new Business(business._id, business.name, business.logo, business.reviews, business.email, business.phoneNumbers, business.workingDays, business.workingHours, business.location, business.tags, business.category, business.description, business.interactivity,
                        business.totalRatings, business.photos, business.paymentRequired, business.deposit, business.averageRating));
                }
                this.businesses = transformedBusiness;
                return transformedBusiness;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

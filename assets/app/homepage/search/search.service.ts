import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Business } from '../business.model';


@Injectable()
export class SearchService {
    private businesses: Business[] = [];

    constructor(private http: Http) { }

    getBusinesses(result: string) {
        //need to modify here to take more than one word

        return this.http.get('http://localhost:8080/api/search?result=' + result+"&&")
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusiness: Business[] = [];
                for (let business of businesses) {
                    transformedBusiness.push(new Business(business._id,business.name,business.logo, business.email, business.phoneNumbers, business.workingDays, business.workingHours,
                        business.address, business.location, business.tags, business.category, business.description, business.interactivity,
                        business.totalRatings, business.photos, business.paymentRequired, business.deposit));
                }
                this.businesses = transformedBusiness;
                return transformedBusiness;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getBusinessesExplore(location:string,category:string) {
                 return this.http.get('http://localhost:8080/api/search?location=' +location+'&category='+category)
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusiness: Business[] = [];
                for (let business of businesses) {
                    transformedBusiness.push(new Business(business._id,business.name,business.logo, business.email, business.phoneNumbers, business.workingDays, business.workingHours,
                        business.address, business.location, business.tags, business.category, business.description, business.interactivity,
                        business.totalRatings, business.photos, business.paymentRequired, business.deposit));
                }
                this.businesses = transformedBusiness;
                return transformedBusiness;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


}

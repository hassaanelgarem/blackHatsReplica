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
        console.log(result);
        console.log('http://localhost:8080/api/search?result=' + result);
        return this.http.get('http://localhost:8080/api/search?result=' + result)
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusiness: Business[] = [];
                for (let business of businesses) {
                    transformedBusiness.push(new Business(business._id,business.name,business.logo, business.email, business.phoneNumbers, business.workingDays, business.workingHours,
                        business.address, business.location, business.tags, business.category, business.description, business.interactivity,
                        business.totalRatings, business.photos, business.paymentRequired, business.deposit));
                }
                // console.log(businesses);
                this.businesses = transformedBusiness;
                return transformedBusiness;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getBusinessesExplore(location:string,category:string) {
                console.log(location,category);
               // console.log( ' route http://localhost:8080/api/search?location=' +location+'&category='+category);
                 return this.http.get('http://localhost:8080/api/search?location=' +location+'&category='+category)
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusiness: Business[] = [];
                for (let business of businesses) {
                    transformedBusiness.push(new Business(business.name, business.email, business.phoneNumbers, business.workingDays, business.workingHours,
                        business.address, business.location, business.tags, business.category, business.description, business.interactivity,
                        business.totalRatings, business.photos, business.paymentRequired, business.deposit, business.logo));
                }
                this.businesses = transformedBusiness;
                // console.log(this.businesses);
                return transformedBusiness;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    viewBusinesses() {
        return this.businesses;
    }

}

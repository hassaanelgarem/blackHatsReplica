import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Business } from '../business.model';


@Injectable()
export class TopBusinessesService {
    private businesses: Business[] = [];

    constructor(private http: Http) { }

    getBusinesses() {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
        //need to modify here to take more than one word
        return this.http.get('http://localhost:8080/api/business/mostPopular', {headers: headers})
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusiness: Business[] = [];
                for (let business of businesses) {
                    transformedBusiness.push(new Business(business._id,business.name,business.logo, []));
                }
                this.businesses = transformedBusiness;
                // console.log(this.businesses);
                return transformedBusiness;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

}

import { Business } from './business.model';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";



@Injectable()
export class BusinessService {
    private alertMsg: string;
    private apiPath: string = "http://54.213.175.206:8080/api/";
    constructor(private http: Http) { }

    getBusinesses() {
        return this.http.get(this.apiPath + 'admin/business/getAll')
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusinesses: Business[] = [];
                for (let business of businesses) {
                    transformedBusinesses.push(new Business(
                        business._id,
                        business.name, business.email, business.location, business.averageRating, business.createdAt
                    ));
                }
                return transformedBusinesses;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

    getUnverifiedBusinesses() {
        return this.http.get(this.apiPath + 'admin/business/unVerifiedBusinesses')
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusinesses: Business[] = [];
                for (let business of businesses) {
                    transformedBusinesses.push(new Business(
                        business._id,
                        business.name, business.email, business.location, business.averageRating, business.createdAt
                    ));
                }
                return transformedBusinesses;
            }).catch((error: Response) => Observable.throw(error.json()));
    }


    deleteBusiness(businessId: string) {
        return this.http.delete(this.apiPath + 'admin/business/delete/' + businessId)
            //map method to transform the response
            .map((response: Response) => {
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    verifyBusiness(businessId: string) {
        return this.http.put(this.apiPath + 'admin/business/verify/' + businessId, { verified: true })
            //map method to transform the response
            .map((response: Response) => {
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

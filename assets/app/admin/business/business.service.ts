import { Business } from './business.model';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";



@Injectable()
export class BusinessService {
    private alertMsg: string;
    private requestSuccess: boolean = false;
    constructor(private http: Http) { }

    getBusinesses() {
        return this.http.get('http://localhost:8080/api/admin/business/getAll')
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusinesses: Business[] = [];
                for (let business of businesses) {
                    transformedBusinesses.push(new Business(
                        business._id,
                        business.name, business.email, business.location, business.totalRatings, business.createdAt
                    ));
                }
                return transformedBusinesses;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

    getUnverifiedBusinesses() {
        return this.http.get('http://localhost:8080/api/admin/business/unVerifiedBusinesses')
            //map method to transform the response
            .map((response: Response) => {
                const businesses = response.json().data;
                let transformedBusinesses: Business[] = [];
                for (let business of businesses) {
                    transformedBusinesses.push(new Business(
                        business._id,
                        business.name, business.email, business.location, business.totalRatings, business.createdAt
                    ));
                }
                return transformedBusinesses;
            }).catch((error: Response) => Observable.throw(error.json()));
    }


    deleteBusiness(businessId: string) {
        return this.http.delete('http://localhost:8080/api/admin/business/delete/' + businessId)
            //map method to transform the response
            .map((response: Response) => {
                if (response.status != 200)
                    this.requestSuccess = false;
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    verifyBusiness(businessId: string) {
        return this.http.put('http://localhost:8080/api/admin/business/verify/' + businessId, {verified: true})
            //map method to transform the response
            .map((response: Response) => {
                if (response.status != 200)
                    this.requestSuccess = false;
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { SupportRequest } from './support.model';


@Injectable()
export class SupportService {
    private alertMsg: string;
    constructor(private http: Http) { }

    getRequests() {
        return this.http.get('http://localhost:8080/api/admin/support/getRequests')
            //map method to transform the response
            .map((response: Response) => {
                const requests = response.json().data;
                let transformedRequests: SupportRequest[] = [];
                for (let request of requests) {
                    transformedRequests.push(new SupportRequest(
                        request._id,
                        request.title, request.contactEmail, request.contactPhoneNumber, request.accountType, request.registeredEmail, request.description, request.createdAt
                    ));
                }
                return transformedRequests;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

    recoverAccount(requestId: string, accountType: string) {
        if (accountType === "Business") {
            return this.http.put('http://localhost:8080/api/admin/support/business/recoverAccount/' + requestId, {})
                //map method to transform the response
                .map((response: Response) => {
                    this.alertMsg = response.json().msg;
                    return this.alertMsg;
                })
                .catch((error: Response) => Observable.throw(error.json()));
        }
        else {
            return this.http.put('http://localhost:8080/api/admin/support/user/recoverAccount/' + requestId, {})
                //map method to transform the response
                .map((response: Response) => {
                    this.alertMsg = response.json().msg;
                    return this.alertMsg;
                })
                .catch((error: Response) => Observable.throw(error.json()));
        }
    }

    rejectRequest(requestId: string) {
        return this.http.delete('http://localhost:8080/api/admin/support/deleteRequest/' + requestId)
            //map method to transform the response
            .map((response: Response) => {
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

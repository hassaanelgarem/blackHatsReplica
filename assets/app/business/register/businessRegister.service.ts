import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Business } from "../business.model";

@Injectable()
export class BusinessRegisterService {
    constructor(private http: Http) { }
    
    signUp(business: Business) {
        const body = JSON.stringify(business);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('http://localhost:8080/api/business/apply', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}
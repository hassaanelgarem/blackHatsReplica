import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Business } from "../business.model";

@Injectable()
export class BusinessRegisterService {
    constructor(private http: Http) { }

    signUp(business: Business) {
        //Creates a JSON Object with the business passed to it, to use as a body for the post route 
        const body = JSON.stringify(business);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        //Adds a header to indicate that the body is a JSON object to pass to the apply post route 
        return this.http.post('http://54.213.175.206:8080/api/business/apply', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

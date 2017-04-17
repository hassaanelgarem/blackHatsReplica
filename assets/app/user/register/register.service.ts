import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { User } from "../user.model";

@Injectable()
export class UserRegisterService {
    constructor(private http: Http) { }

    signUp(user: User) {
        //Creates a JSON Object with the user passed to it, to use as a body for the post route 
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        //Adds a header to indicate that the body is a JSON object to pass to the register post route 
        return this.http.post('http://localhost:8080/api/user/register', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}

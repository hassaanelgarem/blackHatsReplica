import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";


@Injectable()
export class AdminService {
    constructor(private http: Http) { }

    logout() {
        return this.http.get('http://54.213.175.206:8080/api/logout')
            //map method to transform the response
            .map(res => res.json())
    };
}


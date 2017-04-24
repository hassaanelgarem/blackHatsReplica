import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router'
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class AdminGuard implements CanActivateChild {
    private apiPath: string = "http://54.213.175.206:8080/api/";

    constructor(
        private router: Router,
        private http: Http
    ) { }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get(this.apiPath + 'currentUser', { headers: headers }).map((response) => {
            let res = response.json();
            if (res.success && res.user && res.user.admin) {
                return true;
            }
            this.router.navigate(["/notAuthorized-error"]);
            return false;
        }).first();
    }
}

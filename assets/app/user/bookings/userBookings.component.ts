import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from "../user.service";
import { AppService } from '../../app.service';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'app-user-bookings',
    templateUrl: './userBookings.component.html'
})
export class UserBookingsComponent implements OnInit {
    count: Number = 0;
    bookings: [Object];
    userId: String;
    logoPath: String = "http://localhost:8080/api/image/businessLogos/";
    //private user: Object;
    //private loggedin: Boolean;
    //private isUser: Boolean;
    businesses: [Object];
    loaded = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private appService: AppService,
        private userService: UserService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.userId = params['userId'];
                this.userService.getBookingHistory(this.userId).subscribe(
                    (data) => {
                        this.bookings = data.data;
                        this.count = this.bookings.length;
                        this.loaded = true;
                    }, (err) => {
                        switch (err.status) {
                            case 404:
                                this.router.navigateByUrl('/404-error');
                                break;
                            case 401:
                                this.router.navigateByUrl('/notAuthorized-error');
                                break;
                            default:
                                this.router.navigateByUrl('/500-error');
                                break;
                        }
                    });
            }, (err) => {
                switch (err.status) {
                    case 404:
                        this.router.navigateByUrl('/404-error');
                        break;
                    case 401:
                        this.router.navigateByUrl('/notAuthorized-error');
                        break;
                    default:
                        this.router.navigateByUrl('/500-error');
                        break;
                }
            });


    }
}

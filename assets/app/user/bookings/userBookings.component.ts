import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'app-user-bookings',
    templateUrl: './userBookings.component.html'
  })
export class UserBookingsComponent implements OnInit {
    count: Number = 0;
    bookings: [Object];
    userId: String = "58e8d26b86e48c253b2c3c1e";
    logoPath :String = "http://localhost:8080/api/image/businessLogos/";

    constructor(
        private userService: UserService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {

        this.userService.getBookingHistory(this.userId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
              this.bookings = data.data;
              this.count = this.bookings.length;
            }
        });
    }
}

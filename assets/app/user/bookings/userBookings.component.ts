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
    userId: String = "58f252bd9037f62725ddf62c";
    logoPath: String = "http://localhost:8080/api/image/businessLogos/";
    businesses: [Object];
    loaded = false;

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
              var businesses = [];
              for(var i = 0; i < this.bookings.length; i++) {
                this.userService.getCurrentInfo(this.bookings[i].activity.business).subscribe(data => {
                  if (data.err) {
                    console.error(data.msg);
                  }
                  else {
                    businesses.push(data.data);
                  }
                });
              }

              this.businesses = businesses as [Object];
              this.loaded = true;

            }
        });
}
}

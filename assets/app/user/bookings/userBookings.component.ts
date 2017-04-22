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
    userId: String = "58e8d26b86e48c253b2c3c1e";
    logoPath :String = "http://localhost:8080/api/image/businessLogos/";
    //private user: Object;
    //private loggedin: Boolean;
    //private isUser: Boolean;
  

    constructor(
        private activatedRoute: ActivatedRoute,
        private appService: AppService,
        private userService: UserService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userId = params['userId'];
        });
        /*this.appService.getCurrentUser().subscribe(data => {
            if(data.success){
                if(data.user){
                this.user = data.user;
                this.isUser = true;
                this.userId = data.user._id;

                }
                else{
                //business
                }
             this.loggedin = true;
            }
            else{
             this.loggedin = false;
            }
        });
        */

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

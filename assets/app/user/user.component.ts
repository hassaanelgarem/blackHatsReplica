import { Component, OnInit } from '@angular/core';
import { UserService } from "./user.service";
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'user-profile',
   templateUrl: 'user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public showReviews = false;
  public showFavorites = false;
  public showBookings = false;

  user: Object;
  userId: String = "58f2524179efae7640c1c949"; //get the id of the logged in user
  favorites:Object[];
  firstName:String;
  lastName:String;
  email:String;
  birthDate:Date;
  createdAt:Date;
  //loggedIn = false;

  constructor(private userService: UserService,
        private router: Router,
        private http: Http) { }

  ngOnInit() {
    this.userService.getUser(this.userId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
              this.user = data.data;
              this.firstName = this.user.firstName;
              this.lastName = this.user.lastName;
              this.email = this.user.email;
              this.birthDate = this.user.birthDate;
              this.createdAt = this.user.createdAt;

              //this.favorites = this.user.favorites;
            }
        });
  }

  onReviewsClick(){
    this.showReviews = true;
    this.showFavorites = false;
    this.showBookings = false;
  }

  onFavoritesClick(){
    this.showReviews = false;
    this.showFavorites = true;
    this.showBookings = false;
  }

  onBookingsClick(){
    this.showReviews = false;
    this.showFavorites =false;
    this.showBookings = true;
  }

}



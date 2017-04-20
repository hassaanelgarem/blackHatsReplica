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
  public showReviews = true;
  public showFavorites = false;
  public showBookings = false;
  public editProfile = false;

  private profilePicture: String;

  user: Object;
  userId: String = "58f8e785d563aa23994def50"; //get the id of the logged in user
  favorites:Object[];
  firstName:String;
  lastName:String;
  email:String;
  birthDate:Date;
  createdAt:Date;
  path: String = "";
  loggedIn = true;

  constructor(private userService: UserService,
        private router: Router,
        private http: Http) { }

  ngOnInit() {
    this.userService.getOneUser(this.userId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
              this.user = data.data;
              this.firstName = data.data.firstName;
              this.lastName = data.data.lastName;
              this.email = data.data.email;
              this.birthDate = data.data.birthDate;
              this.createdAt = data.data.createdAt;
              if (data.data.profilePicture != null) {
                    this.path = "http://localhost:8080/api/image/profilePictures/";
                    this.profilePicture = data.data.profilePicture;
                }
                else {
                    this.path = "";
                    this.profilePicture = "http://localhost:8080/api/image/profilePictures/defaultpp.jpg";
                }


              //this.favorites = this.user.favorites;
            }
        });
  }

  onReviewsClick(){
    this.showReviews = true;
    this.showFavorites = false;
    this.showBookings = false;
    this.editProfile = false;
  }

  onFavoritesClick(){
    this.showReviews = false;
    this.showFavorites = true;
    this.showBookings = false;
    this.editProfile = false;
  }

  onBookingsClick(){
    this.showReviews = false;
    this.showFavorites =false;
    this.showBookings = true;
    this.editProfile = false;
  }

  onEditProfileClick(){
    this.showReviews = false;
    this.showFavorites =false;
    this.showBookings = false;
    this.editProfile = true;

  }

}

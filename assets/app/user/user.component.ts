import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public showReviews = false;
  public showBookings = false;
  public showEdit = false;
  public showFavorites = false;

  constructor() { }

  ngOnInit() {
  }

  onReviewsClick(){
    this.showReviews = true;
    this.showBookings = false;
    this.showEdit = false;
    this.showFavorites = false;
  }

  onBookingsClick(){
    this.showReviews = false;
    this.showBookings = true;
    this.showEdit = false;
    this.showFavorites = false;
  }

  onEditClick(){
    this.showReviews = false;
    this.showBookings = false;
    this.showEdit = true;
    this.showFavorites = false;
  }

  onFavoritesClick(){
    this.showReviews = false;
    this.showBookings = false;
    this.showEdit = false;
    this.showFavorites = true;
  }

}

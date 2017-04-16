import { Component, OnInit } from '@angular/core';
import {BusinessService} from './business.service';
// import 'rxjs/add/operator/map';

@Component({
  selector: 'app-business',
  templateUrl: './businessEdit.component.html',
  styleUrls: ['./businessEdit.component.css']
})
export class BusinessEditComponent implements OnInit {

  public showActivities = true;
  public showPhotos = false;
  public showReviews = false;
  public showBookings = false;
  public showEdit = false;
  public showAds = false;

  constructor(private businessService: BusinessService) { }

  ngOnInit() {
  }

  onActivitiesClick(){
    this.showActivities = true;
    this.showPhotos = false;
    this.showReviews = false;
    this.showBookings = false;
    this.showEdit = false;
    this.showAds = false;
  }

  onPhotosClick(){
    this.showActivities = false;
    this.showPhotos = true;
    this.showReviews = false;
    this.showBookings = false;
    this.showEdit = false;
    this.showAds = false;
  }

  onReviewsClick(){
    this.showActivities = false;
    this.showPhotos = false;
    this.showReviews = true;
    this.showBookings = false;
    this.showEdit = false;
    this.showAds = false;
  }

  onBookingsClick(){
    this.showActivities = false;
    this.showPhotos = false;
    this.showReviews = false;
    this.showBookings = true;
    this.showEdit = false;
    this.showAds = false;
  }

  onEditClick(){
    this.showActivities = false;
    this.showPhotos = false;
    this.showReviews = false;
    this.showBookings = false;
    this.showEdit = true;
    this.showAds = false;
  }

  onAdsClick(){
    this.showActivities = false;
    this.showPhotos = false;
    this.showReviews = false;
    this.showBookings = false;
    this.showEdit = false;
    this.showAds = true;
  }

  onTestBusinessLogin(){
    console.log("onTestBusinessLogin");
    this.businessService.testBusinessLogin().subscribe(data => {
      console.log(data);
    })
  }

}

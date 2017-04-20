import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ActivityBookingsService } from "./activityBookings.service";
import { Router } from '@angular/router';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-activityBookings',
  templateUrl: './activityBookings.component.html',
  styleUrls: ['./activityBookings.component.css']
})
export class ActivityBookingsComponent implements OnInit {
  activities: [{
      name: String,
      price: Number,
      description: String,
      photos: String,
      bookingsPerSlot: Number,
      slots: [{
        startTime: Date,
        endTime: Date
      }],
      business: String,
      bookings: Object[]
  }];
  activityNames: string[] = [];
  currentBookings: Object[];

  constructor(
    private activityBookingsService: ActivityBookingsService,
    private router: Router,
    private http: Http) { }


  ngOnInit() {
    this.getActivityBookings();
  }

  getActivityBookings(){
    this.activityBookingsService.getBookings("58e8d68ce4a2cf7c06cff89a").subscribe(data => {
      if (data.err) {
          console.error(data.msg);
      }
      else {
        this.activities = data.data;
        for(let i = 0; i < data.data.length; i++){
          this.activityNames.push(data.data[i].name);
        }
      }
    });
  }


  getBookings(chosenActivity){
    this.currentBookings = this.activities[chosenActivity].bookings;

  }

}

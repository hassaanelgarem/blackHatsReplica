import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ActivityBookingsService } from "./activityBookings.service";
import { Router } from '@angular/router';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppService } from '../../app.service';

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
  businessId: String;

  constructor(
    private activityBookingsService: ActivityBookingsService,
    private router: Router,
    private appService: AppService,
    private http: Http) { }


  ngOnInit() {
    this.getActivityBookings();
  }

  getActivityBookings(){
    this.appService.getCurrentUser().subscribe(
    (data) => {
      if(data.success){
        this.businessId = data.business._id;

        this.activityBookingsService.getBookings(this.businessId).subscribe(data => {
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
    })

  }


  getBookings(chosenActivity){
    this.currentBookings = this.activities[chosenActivity].bookings;
  }

}

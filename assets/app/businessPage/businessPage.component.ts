import { Component, OnInit } from '@angular/core';
import {BusinessPageService} from './businessPage.service';
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-business-page',
  templateUrl: './businessPage.component.html'
})
export class BusinessPageComponent implements OnInit {

  name: String;
  address: String;
  phoneNumbers: [String];
  totalRatings: Number;
  rating: String;
  activities: [Object];
  businessId: String = "58ee4577fa669f51b6abf3ae";
  path: String = "http://localhost:8080/api/";
  business: Object;
  loadDone = false;

  constructor(
    private businessPageService: BusinessPageService,
    private router: Router,
    private http: Http) { }

  ngOnInit() {
    this.businessPageService.getBusinessInfo(this.businessId).subscribe(info => {
            if (info.err) {
                console.error(info.msg);
            }
            else {
                console.log(info);
                this.business = info.data;
                this.name = info.data.name;
                this.address = info.data.address;
                this.phoneNumbers = info.data.phoneNumbers;
                this.totalRatings = info.data.totalRatings;
                this.loadDone = true;
            }
        });
    //
        // this.businessPageService.getAverageRating(this.businessId).subscribe(info => {
        //         if (info.err) {
        //             console.error(info.msg);
        //         }
        //         else {
        //             this.rating = info.data.toFixed(1);
        //         }
        //     });
    //
        this.businessPageService.getActivities(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.activities = info.data;
                }
            });


  }

}

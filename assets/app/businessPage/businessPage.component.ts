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
  activties: [Object];
  businessId: String = "58f28a95701573fd750a9b1c";

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
                this.name = info.data.name;
                this.address = info.data.address;
                this.phoneNumbers = info.data.phoneNumbers;
                this.totalRatings = info.data.totalRatings;
            }
        });

        this.businessPageService.getAverageRating(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.rating = info.data.toFixed(1);
                }
            });

        this.businessPageService.getActivities(this.businessId).subscribe(info => {
                if (info.err) {
                    console.error(info.msg);
                }
                else {
                    this.activties = info.data;
                }
            });


  }

}

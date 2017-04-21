import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { BookAdvService} from "./bookAdv.service"
import { Router } from '@angular/router';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-bookAdv',
  templateUrl: './bookAdv.component.html',
  styleUrls: ['./bookAdv.component.css']
})
export class BookAdvComponent implements OnInit {
  advertisements: Object[];
  availableSlots: Date[] = [];
  date: Date;
  noOfDays: number[] = [];
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/advertisement/addAdvPhoto', itemAlias: "myfile" });;
  startTime : Date = new Date();
  endTime: Date = new Date();
  startTimeValue: Date  = new Date();
  endTimeValue: Date = new Date();
  path: String;
  advPicture: String;

  private advNoOfDaysWarning: boolean = false;
  private advImgWarning: boolean = false;
  private successfulBooking: boolean = false;

  constructor(
    private bookAdvService: BookAdvService,
    private router: Router,
    private http: Http) { }

  ngOnInit() {
    this.showAdvSlots();
  }

  showAdvSlots(){
    this.bookAdvService.getAdvSlots().subscribe(data => {
        if (data.err) {
            console.error(data.msg);
        }
        else {
          this.advertisements = data.data;
          let i = 0;
          for(let advertisement of this.advertisements){
              this.getFreeSlot(data.data[i]._id);
              i++;
          }
        }
    });

  }

   getFreeSlot(index){
    this.bookAdvService.getFreeSlot(index).subscribe(data => {
      if (data.err) {
          console.error(data.msg);
      }
      else {
        this.availableSlots.push(data.data);
      }
    });
  }

  uploadAdvPicture(){
    this.uploader.uploadAll();
    this.uploader.onCompleteItem = (item: any, response: any, status:any, headers:any) => {
    this.advPicture = JSON.parse(response).data;
    console.log(this.advPicture);
    this.path = "http://localhost:8080/api/image/businessAds/";
    }
  }


  bookAdv(advId, index){
    if(!this.noOfDays || this.noOfDays.length == 0){
      this.advNoOfDaysWarning = true;
    }
    else {
      this.advNoOfDaysWarning = false;
    }
    if(!this.advPicture || this.advPicture.length == 0){
      this.advImgWarning = true;
    }
    else {
      this.advImgWarning = false;
    }
    if(!this.advImgWarning && !this.advImgWarning){
      this.startTimeValue = new Date(this.availableSlots[index]);
      this.endTimeValue.setDate(this.startTimeValue.getDate() + this.noOfDays[index]);
      console.log("I am here");
      console.log(this.startTimeValue);
      console.log(this.endTimeValue);
      console.log(this.noOfDays[index]);
      console.log(this.advPicture);
      this.bookAdvService.bookAdvSlot(this.startTimeValue, this.endTimeValue, this.advPicture, advId).subscribe(
        (data) => {
          bootbox.alert(data.msg);
        },
        (err) => {
          switch (err.status) {
              case 404:
                  console.log("404 not found");
                  break;
              case 401:
                  console.log("Unauthorized");
                  break;
              default:
                  console.log("Oops something went wrong");
                  break;
          }
        }
      );
    }
  }

  hideAdvImgWarning(){
    this.advImgWarning = false;
  }

  hideNoOfDaysWarning(){
    this.advNoOfDaysWarning = false;
  }





}

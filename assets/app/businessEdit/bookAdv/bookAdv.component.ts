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
    this.path = "http://localhost:8080/api/image/businessAds/";
    }
  }


  bookAdv(advId, index){
    this.startTimeValue = new Date(this.availableSlots[index]);
    this.endTimeValue.setDate(this.startTimeValue.getDate() + this.noOfDays[index]);
    this.bookAdvService.bookAdvSlot(this.startTimeValue, this.endTimeValue, this.path, advId).subscribe(data => {
      if (data.err) {
          console.error(data.msg);
      }
    });
  }
}

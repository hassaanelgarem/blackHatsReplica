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
  noOfDays: number = 0;
  public uploader: FileUploader;
  startTime : Date = new Date();
  endTime: Date = new Date();
  startTimeValue: Date  =new Date();
  endTimeValue: Date = new Date();



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






  bookAdv(advId, index){
    this.startTimeValue = this.availableSlots[index];
    this.endTimeValue.setDate(this.startTimeValue.getDate() + this.noOfDays);
    this.uploader = new FileUploader({ url: 'http://localhost:8080/api/api/advertisement/bookAdvSlot/' + advId, itemAlias: "myfile" });
    this.uploader.onBuildItemForm = (item, form) => {
      form.append(this.startTime, this.startTimeValue);
      form.append(this.endTime, this.endTimeValue);
    };
    this.uploader.uploadAll();
  }


}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-business',
  templateUrl: './businessEdit.component.html',
  styleUrls: ['./businessEdit.component.css']
})
export class BusinessEditComponent implements OnInit {

  public showDashboard = true;
  public showOther = false;

  constructor() { }

  ngOnInit() {
  }

  onDashboardClick(){
    this.showDashboard = true;
    this.showOther = false;
    console.log("On Dashboard");
  }

  onOtherClick(){
    this.showDashboard = false;
    this.showOther = true;
    console.log("On Other");
  }

}

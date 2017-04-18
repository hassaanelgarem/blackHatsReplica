import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls : ['./nav.component.css']
})
export class NavComponent implements OnInit {

//to check for this part later
  private loggedin;

  constructor(private appService: AppService) { }

  ngOnInit() {
    // call current user backend function
    this.loggedin=this.appService.status();
  }

  logout(){
    this.loggedin=this.appService.logout();
    }

}

import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { LoginService } from '../user/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls : ['./nav.component.css']
})
export class NavComponent implements OnInit {

//to check for this part later
  private loggedin: Boolean;
  private isUser: Boolean;
  private user: Object;
  private business: Object;
  private path: String = "http://localhost:8080/";

  constructor(
    private appService: AppService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.appService.getCurrentUser().subscribe(data => {
      if(data.success){
        if(data.user){
          this.user = data.user;
          this.isUser = true;

        }
        else{
          this.business = data.business;
          this.isUser = false;
        }
        this.loggedin = true;
      }
      else{
        this.loggedin = false;
      }
    });
  }

  loggedIn(args:any){
    this.appService.getCurrentUser().subscribe(data => {
      if(data.success){
        if(data.user){
          this.user = data.user;
          this.isUser = true;

        }
        else{
          this.business = data.business;
          this.isUser = false;
        }
        this.loggedin = true;
      }
      else{
        this.loggedin = false;
      }
    });
  }

  onLogout(){
    this.loginService.logout().subscribe(data => {
      location.reload();
    }, err => {
      bootbox.alert(err.msg);
    });

    }
}

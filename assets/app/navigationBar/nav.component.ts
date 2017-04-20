import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { LoginService } from '../user/login/login.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls : ['./nav.component.css']
})
export class NavComponent implements OnInit {

//to check for this part later
  private loggedin;

  constructor(
    private appService: AppService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    // to call hassaan's service
  }

  onLogout(){
    this.loginService.logout().subscribe(data => {
      console.log('loggedout');
      this.loggedin = false;
    }, err => {
      console.log('loggedout failed');
    });
    }

}

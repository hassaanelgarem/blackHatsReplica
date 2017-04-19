import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  private isLoggedin = false;

  constructor() { }

  // to do from the database
  login(){

      //should add here the linking to backend function

      this.isLoggedin=true;
      return this.isLoggedin;
  }

  logout(){

      //should add here the linking to backend function

      this.isLoggedin=false;
      return this.isLoggedin;
  }

  status(){
      return this.isLoggedin;
  }

}

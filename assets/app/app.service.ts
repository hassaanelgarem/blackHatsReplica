import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  private isLoggedin = true;

  constructor() { }

  // to do from the database
  login(){

  }

  logout(){

  }

  status(){
      return this.isLoggedin;
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'user-favorites',
    templateUrl: './favorites.component.html',
    
})
export class FavoritesComponent {
    userId: String = "58f2524179efae7640c1c949"; //get the id of the logged in user
    count: Number = 15;
    user: Object;
    favorites: Object[]; //array of business ids
    

    constructor(private userService: UserService,
        private router: Router,
        private http: Http) {}

    ngOnInit() {
    this.userService.getUser(this.userId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
              this.user = data.data;
              //this.favorites = this.user.favorites;
              //this.count = this.user.favorites.length;
             
            }
        });
  }   

}
import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../user.service';
import { AppService } from '../../app.service';
import { Http, Headers } from '@angular/http';
import{UserComponent} from "../user.component";
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-user-favorites',
  templateUrl: './favorites.component.html'
})
export class UserFavoritesComponent implements OnInit {
  private loggedin: Boolean;
  private isUser: Boolean;
  private user: Object;
  favorites: [String];
  businesses: [Object];
  userId: String = "";//"58e8d26b86e48c253b2c3c1e";
  logoPath :String = "http://localhost:8080/api/image/businessLogos/";
  loggedIn : Boolean;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private userComponent: UserComponent,
    private appService: AppService,
    private userService: UserService,
    private router: Router,
    private http: Http) { }

  ngOnInit() {
    this.loggedIn = this.userComponent.isLoggedIn();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params['userId'];
    });
    
    this.appService.getCurrentUser().subscribe(data => {
        if(data.success){
            if(data.user){
              this.user = data.user;
              this.isUser = true;
              this.userId = data.user._id;

            }
            else{
                //business
            }
            this.loggedin = true;
        }
       else{
          this.loggedin = false;
        }
      });

    this.userService.getOneUser(this.userId).subscribe(data => {
      if (data.err) {
        console.error(data.msg);
      }
      else {
        this.user = data.data;
        this.favorites = data.data.favorites;
        var businesses = [];
        for (var i = 0; i < this.favorites.length; i++){
          this.userService.getCurrentInfo(this.favorites[i]).subscribe(data => {
            if (data.err) {
              console.error(data.msg);
            }
            else {
              businesses.push(data.data);
            }
          });
        }
        this.businesses = businesses as [Object];
      }
    });

  }

   deleteFavorite(i){

    this.userService.deleteFavorite(this.favorites[i]).subscribe(
      (data) => {
        console.log("no error");
        this.businesses.splice(i, 1);
      },
      (err) => {
        switch(err.status){
              case 404:
                //console.log("404 not found");
                this.router.navigateByUrl('404-error');
                break;
              case 401:
                //console.log("Unauthorized");
                this.router.navigateByUrl('notAuthorized-error');
                break;
              default:
                //console.log("Oops somethings went wrong");
                this.router.navigateByUrl('500-error');
                break;
            }

      }
    );

  }


}

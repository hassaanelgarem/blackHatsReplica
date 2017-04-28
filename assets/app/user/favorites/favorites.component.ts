import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../user.service';
import { AppService } from '../../app.service';
import { Http, Headers } from '@angular/http';
import { UserComponent } from "../user.component";
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
    logoPath: String = "http://localhost:8080/api/image/businessLogos/";
    loggedIn: Boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private userComponent: UserComponent,
        private appService: AppService,
        private userService: UserService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
        this.loggedIn = this.userComponent.isLoggedIn();
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.userId = params['userId'];
                this.appService.getCurrentUser().subscribe(
                    (data) => {
                        if (data.success) {
                            if (data.user) {
                                this.isUser = true;
                                if (this.userId == data.user._id) {
                                    this.loggedIn = true;
                                }
                                else {
                                    this.loggedIn = false;
                                }
                            }
                            else {
                                this.loggedIn = false;
                            }
                        }
                        else {
                            this.loggedin = false;
                        }
                        this.userService.getOneUser(this.userId).subscribe(
                            (data) => {
                                this.user = data.data;
                                this.favorites = data.data.favorites;
                                var businesses = [];
                                for (var i = 0; i < this.favorites.length; i++) {
                                    this.userService.getCurrentInfo(this.favorites[i]).subscribe(
                                        (data) => {
                                            businesses.push(data.data);
                                        }, (err) => {
                                            switch (err.status) {
                                                case 404:
                                                    this.router.navigateByUrl('/404-error');
                                                    break;
                                                case 401:
                                                    this.router.navigateByUrl('/notAuthorized-error');
                                                    break;
                                                default:
                                                    this.router.navigateByUrl('/500-error');
                                                    break;
                                            }
                                        });
                                }
                                this.businesses = businesses as [Object];
                            }, (err) => {
                                switch (err.status) {
                                    case 404:
                                        this.router.navigateByUrl('/404-error');
                                        break;
                                    case 401:
                                        this.router.navigateByUrl('/notAuthorized-error');
                                        break;
                                    default:
                                        this.router.navigateByUrl('/500-error');
                                        break;
                                }
                            });
                    });
            }, (err) => {
                switch (err.status) {
                    case 404:
                        this.router.navigateByUrl('/404-error');
                        break;
                    case 401:
                        this.router.navigateByUrl('/notAuthorized-error');
                        break;
                    default:
                        this.router.navigateByUrl('/500-error');
                        break;
                }
            });
    }

    deleteFavorite(i) {
        var _this = this;
        bootbox.confirm({
            title: "Delete Favorite",
            message: "Are you sure you want to remove this business from your favorites?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function (result) {
                if (result) {
                    _this.userService.deleteFavorite(_this.favorites[i]).subscribe(
                        (data) => {
                            _this.businesses.splice(i, 1);
                        },
                        (err) => {
                            switch (err.status) {
                                case 404:
                                    _this.router.navigateByUrl('/404-error');
                                    break;
                                case 401:
                                    _this.router.navigateByUrl('/notAuthorized-error');
                                    break;
                                default:
                                    _this.router.navigateByUrl('/500-error');
                                    break;
                            }

                        }
                    );
                }
            }
        });
    }
}

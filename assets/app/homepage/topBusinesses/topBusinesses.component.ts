import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TopBusinessesService } from "./topBusinesses.service";
import { Business } from '../business.model';


@Component({
    selector: 'homepage-topBusinesses',
    templateUrl: './topBusinesses.component.html',
    styleUrls: ['topBusinesses.component.css']
})
export class TopBusinessesComponent implements OnInit {
    private businesses: Business[] = [];

    constructor(
        private topBusinessesService: TopBusinessesService,
        private router: Router) { }

    ngOnInit() {
        this.topBusinessesService.getBusinesses()
            .subscribe(
            (business: Business[]) => {
                this.businesses = business;
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

}

import { Component, OnInit } from '@angular/core';

import { TopBusinessesService } from "./topBusinesses.service";
import { Business } from '../business.model';


@Component({
  selector: 'homepage-topBusinesses',
  templateUrl: './topBusinesses.component.html'
})
export class TopBusinessesComponent implements OnInit {
  private businesses: Business[] = [];
  constructor(private topBusinessesService: TopBusinessesService) { }

  ngOnInit() {
    this.topBusinessesService.getBusinesses()
      .subscribe(
      (business: Business[]) => {
        this.businesses = business;
        // console.log(this.businesses)
      });
  }

}

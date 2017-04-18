import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { SearchService } from './search.service';
import { Business } from '../business.model';


@Component({
  selector: 'homepage-search',
  templateUrl: './search.component.html',
  styleUrls :['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private searchService: SearchService, private router: Router) { }

  ngOnInit() {
  }

  searchClicked(result:string) {
    //i should render business page and then on init of the business should take the lead
    console.log(result);
    this.searchService.getBusinesses(result)
      .subscribe(
      (business: Business[]) => {
        // console.log(result);
        // console.log(business);
        this.router.navigate(['viewBusinessesSearch']);
      });
  }

   exploreClicked(location:string,category:string) {
    //i should render business page and then on init of the business should take the lead
    console.log(category,location);
    this.searchService.getBusinessesExplore(location,category)
      .subscribe(
      (business: Business[]) => {
        
        // console.log(business);
        //to add here the location
        // this.router.navigate(['viewBusinessesSearch']);
      });
  }

}

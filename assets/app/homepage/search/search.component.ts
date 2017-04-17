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
   result:string;
   location:string;
   category:string;

  constructor(private searchService: SearchService, private router: Router) { }

  ngOnInit() {
  }

  searchClicked() {
    //i should render business page and then on init of the business should take the lead
    this.searchService.getBusinesses(this.result)
      .subscribe(
      (business: Business[]) => {
        console.log(this.result);
        // console.log(business);
        this.router.navigate(['viewBusinessesSearch']);
      });
  }

   exploreClicked() {
    //i should render business page and then on init of the business should take the lead
    this.searchService.getBusinessesExplore(this.location,this.category)
      .subscribe(
      (business: Business[]) => {
        
        // console.log(business);
        //to add here the location
        this.router.navigate(['viewBusinessesSearch']);
      });
  }

}

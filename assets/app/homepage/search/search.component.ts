import { Component, OnInit } from '@angular/core';

import { SearchService } from './search.service';
import { Business } from './business.model';


@Component({
  selector: 'homepage-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  searchClicked(result: string) {
    //i should render business page and then on init of the business should take the lead
    this.searchService.getBusinesses(result)
      .subscribe(
      (business: Business[]) => {
        
        console.log(business)
      });
  }

}

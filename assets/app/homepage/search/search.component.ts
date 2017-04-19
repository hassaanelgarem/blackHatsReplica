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
    this.router.navigate(['search'],{queryParams :{ result : result ,page :"1"}});
  }

   exploreClicked(location:string,category:string) {
   
  }

}

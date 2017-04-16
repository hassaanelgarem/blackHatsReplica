import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'homepage-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  searchClicked(result: string) {
    this.router.navigate(['search'], {queryParams: {result: result, page: "1"}});
  };

}

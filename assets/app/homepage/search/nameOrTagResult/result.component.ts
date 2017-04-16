import { Component, OnInit } from '@angular/core';

import { SearchService } from '../search.service';
import { Business } from '../business.model';


@Component({
    selector: 'homepage-business-result',
    templateUrl: './result.component.html'
})
export class NameOrTagComponent implements OnInit {
    private businesses: Business[] = [];


    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.businesses = this.searchService.viewBusinesses();
        console.log(this.businesses);
    }

}

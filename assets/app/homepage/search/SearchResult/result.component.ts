import { Component, OnInit } from '@angular/core';

import { SearchService } from '../search.service';
import { Business } from '../../business.model';


@Component({
    selector: 'homepage-business-result',
    templateUrl: './result.component.html'
})
export class SearchResultComponent implements OnInit {
    private businesses: Business[] = [];


    constructor(private searchService: SearchService) { }

    ngOnInit() {
        
    }

}

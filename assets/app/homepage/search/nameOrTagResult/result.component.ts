import { Observable } from 'rxjs/Rx';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchService } from '../search.service';
import { Business } from '../business.model';


@Component({
    selector: 'homepage-search-result',
    templateUrl: './result.component.html'
})
export class NameOrTagComponent implements OnInit {
    private businesses: Business[] = [];
    private temp: Observable<Business[]>;
    private sliced: Business[] = [];
    private pagingIndex: number[] = [];
    private pageNumber: number;
    private searchQuery: string;

    constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe(params => {
                this.pageNumber = +params['page'];
                this.searchQuery = params['result'];
                this.searchService.getBusinesses(this.searchQuery).subscribe(businesses => {
                    this.businesses = businesses;
                    this.sliced = this.businesses.slice(this.pageNumber - 1, this.pageNumber * 16 + 15);
                    this.pagingIndex = new Array(Math.ceil(this.businesses.length / 16));
                });
            });
    }

    nextPage() {
        this.router.navigate(['search'], { queryParams: { result: this.searchQuery, page: this.pageNumber + 1 || 1 } });
    }

    previousPage() {
        this.router.navigate(['search'], { queryParams: { result: this.searchQuery, page: this.pageNumber - 1 || 1 } });
    }
}

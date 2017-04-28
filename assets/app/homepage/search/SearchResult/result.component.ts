import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Rx';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchService } from '../search.service';
import { Business } from '../../business.model';


@Component({
    selector: 'homepage-search-result',
    templateUrl: './result.component.html'
})
export class SearchResultComponent implements OnInit, AfterViewChecked {
    private businesses: Business[] = [];
    private temp: Observable<Business[]>;
    private sliced: Business[] = [];
    private pagingIndex: number[] = [];
    private pageNumber: number = 1;
    private searchQuery: string;
    private sort: string;
    private result: string;
    private location: string;
    private category: string;

    constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.getQueryParams();
        this.search();
    }


    search() {
        this.searchService.getBusinesses(this.searchQuery).subscribe(
            (businesses) => {
                this.businesses = businesses;
                this.pagingIndex = new Array(Math.ceil(this.businesses.length / 16));
                this.updatePage(1);
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

    getQueryParams() {
        this.route
            .queryParams
            .subscribe((params) => {
                this.result = params['result'];
                this.location = params['location'];
                this.category = params['category'];
                this.searchQuery = "result=" + this.result;
                if (!this.result) {
                    this.searchQuery = "location=" + this.location + "&category=" + this.category;
                }
                this.searchQuery = this.searchQuery + "&sort=" + this.sort;
            },
            (err) => {

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

    previous() {
        if (!(this.pageNumber < 1)) {
            this.updatePage(this.pageNumber-1);
        }
    }

    next() {
        if (this.pageNumber < this.pagingIndex.length) {
            this.updatePage(this.pageNumber+1);
        }
    }

    updatePage(page: number) {
        $("#page" + this.pageNumber).removeClass("active");
        this.sliced = this.businesses.slice(page - 1, this.pageNumber * 16 + 15);
        this.pageNumber = page;
        $("#page" + this.pageNumber).addClass("active");
    }

    updateSortQuery(sortValue: string) {
        this.sort = sortValue;
        this.getQueryParams();
        this.search();
    }

    ngAfterViewChecked() {
        $("#page" + this.pageNumber).addClass("active");
    }
}

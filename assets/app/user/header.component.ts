import { Component } from "@angular/core";

@Component({
    selector: 'app-header',
    template: `
       <header class="row spacing">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-tabs">
                    <li routerLinkActive="active"><a [routerLink]="['reviews']">Reviews</a></li>
                    <li routerLinkActive="active"><a [routerLink]="['favourites']">Favourites</a></li>
                </ul>
            </nav>
        </header>
    `
})
export class HeaderComponent {

}
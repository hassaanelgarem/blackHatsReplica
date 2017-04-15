import { Component } from "@angular/core";

@Component({
    selector: 'user-header',
    template: `
        <header class="row">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-pills">
                    <li routerLinkActive="active"><a [routerLink]="['/reviews']">Reviews</a></li>
                    <li routerLinkActive="active"><a [routerLink]="['/favorites']">Favorites</a></li>
                </ul>
            </nav>
        </header>
    `
})
export class UserHeaderComponent {

}
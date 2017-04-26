import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<div id="introLoader" class="introLoading"></div>
    <router-outlet></router-outlet>`,
    styles: ["@import '/bootstrap/css/bootstrap.min.css';"]
})

export class AppComponent {

}

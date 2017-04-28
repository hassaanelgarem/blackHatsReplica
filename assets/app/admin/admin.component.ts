import { AfterViewInit, Component } from '@angular/core';

@Component({
    selector: 'my-app-admin',
    template: `<router-outlet></router-outlet>`,
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements AfterViewInit {
    ngAfterViewInit() {
        // var s1 = document.createElement("script");
        $.getScript("/admin/js/custom.min.js");
        // document.getElementsByTagName('body')[0].appendChild(s1);
    }
}

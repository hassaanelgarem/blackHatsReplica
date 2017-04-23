import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './footer.component.html'
})


export class FooterComponent implements AfterViewInit {
  ngAfterViewInit (){
    var s1 = document.createElement("script");
    s1.src = "/admin/js/custom.min.js";
    document.getElementsByTagName('body')[0].appendChild(s1);
  }
};

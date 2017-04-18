import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './sidebar.component.html'
})


export class SidebarComponent {
  constructor(private elementRef: ElementRef) { }
  ngAfterViewInit() {
    var s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.src = "/admin/js/custom.min.js";
    this.elementRef.nativeElement.appendChild(s1);
  }
};

import { Component, OnInit } from '@angular/core';

import { TopBusinessesService } from "./topBusinesses/topBusinesses.service";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers :[TopBusinessesService]
})
export class HomepageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

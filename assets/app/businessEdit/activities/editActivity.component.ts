import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'activity-edit',
  templateUrl: './editActivity.component.html'
})
export class EditActivityComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        let id = params['activityId'];
        console.log(id);
      });
  }

}

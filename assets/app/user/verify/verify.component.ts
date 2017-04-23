import { Component, OnInit } from '@angular/core';
import { VerifyService } from './verify.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html'
})

export class VerifyComponent implements OnInit {

    private token: String;
    private userId: String;

  constructor(
    private verifyService: VerifyService,
    private router: Router,
    private http: Http,
    private route: ActivatedRoute
    ) { }

  ngOnInit() { 

    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.verifyService.verifyToken(this.token).subscribe(data => {
          if(data.msg === "Token is valid.") {
            this.userId = data.data.id;
          } 
          else {
            //aya error 500 only!!
          }
      }, err => {
          //aya errors
      });
    })

  }

  onVerifyUser() {

    this.verifyService.confirmId(this.userId).subscribe(data => {}, err => {
      //aya errors
    });
  }

}
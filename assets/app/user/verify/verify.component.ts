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
      //console.log(this.token);
      this.verifyService.verifyToken(this.token).subscribe(data => {
          console.log(data.data.id);
          this.userId = data.data.id;
      }, err => {
        console.log(err);
          //this.router.navigate(['/']);
          //location.reload();
          //page 404
      });
    })

  }

  onVerifyUser() {

    this.verifyService.confirmId(this.userId).subscribe(data => {
      console.log(data);
    });
  }

}
import { Component, OnInit } from '@angular/core';
import { ResetPasswordService } from './resetPassword.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-resetPass',
  templateUrl: './resetPassword.component.html'
})

export class ResetPasswordComponent implements OnInit {

  private token: String;
  private id: String;
  private password: String;
  private confirmPassword: String;

  constructor(
    private resetPasswordService: ResetPasswordService,
    private router: Router,
    private http: Http,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.token = params['token'];
      //console.log(this.token);
      this.resetPasswordService.passwordToken(this.token).subscribe(data => {
        this.id = data.data.id;
      }, err => {
        this.router.navigate(['/']);
        location.reload();
        //page 404
      });
    })

  }

  onResetPassword() {

    this.resetPasswordService.passwordId(this.id, this.password, this.confirmPassword).subscribe(data => {
      console.log(data);
    });
  }

}
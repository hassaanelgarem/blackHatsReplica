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

    private resetFailure: String;


    //warning Flags

    private passwordWarning: boolean = false;
    private confirmPasswordWarning: boolean = false;
    private resetFailureWarning: boolean = false;

    constructor(
        private resetPasswordService: ResetPasswordService,
        private router: Router,
        private http: Http,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.route.params.subscribe(
            (params) => {
                this.token = params['token'];
                this.resetPasswordService.passwordToken(this.token).subscribe(data => {
                    this.id = data.data.id;
                }, (err) => {
                    switch (err.status) {
                        case 404:
                            this.router.navigateByUrl('/404-error');
                            break;
                        case 401:
                            this.router.navigateByUrl('/notAuthorized-error');
                            break;
                        default:
                            this.router.navigateByUrl('/500-error');
                            break;
                    }
                });
            })

    }

    onResetPassword() {

        if (!this.password || this.password.length == 0) {
            this.resetFailureWarning = false;
            this.passwordWarning = true;
            setTimeout(() => {
                this.passwordWarning = false;
            }, 5000);
        }
        else {
            this.passwordWarning = false;
        }
        if (!this.confirmPassword || this.confirmPassword.length == 0) {
            this.resetFailureWarning = false;
            this.confirmPasswordWarning = true;
            setTimeout(() => {
                this.confirmPasswordWarning = false;
            }, 5000);
        }
        else {
            this.confirmPasswordWarning = false;
        }

        if (!this.passwordWarning && !this.confirmPasswordWarning) {
            this.resetPasswordService.passwordId(this.id, this.password, this.confirmPassword).subscribe(data => {
                this.router.navigate(["/"]);
            }, err => {
                this.password = null;
                this.confirmPassword = null;
                this.resetFailureWarning = true;
                setTimeout(() => {
                    this.resetFailureWarning = false;
                }, 5000);

                if (err.status == 500) {
                    this.resetFailure = err.json().error[0].msg;
                }
                else {
                    this.resetFailure = err.json().msg;
                }

            });
        }
    }


    hidePasswordWarning() {
        this.passwordWarning = false;
    }

    hideConfirmPasswordWarning() {
        this.confirmPasswordWarning = false;
    }

    hideResetFailureWarning() {
        this.resetFailureWarning = false;
    }
}

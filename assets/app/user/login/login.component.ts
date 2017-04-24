import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from './login.service';
import { AppService } from '../../app.service';
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'app-signin',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    @Output() loginClicked = new EventEmitter<boolean>();

    private username: String;
    private userPassword: String;
    private userEmail: String;

    private businessEmail: String;
    private businessPassword: String;

    private successReset: String;
    private failedReset: String;
    private successBusinessReset: String;
    private failedBusinessReset: String;

    private successResend: String;
    private failedResend: String;




    //warning Flags

    private userUsernameWarning: boolean = false;
    private userPasswordWarning: boolean = false;
    private businessEmailWarning: boolean = false;
    private businessPasswordWarning: boolean = false;
    private incorrectUserWarning: boolean = false;
    private incorrectBusinessWarning: boolean = false;
    private resetUserEmailWarning: boolean = false;
    private resetBusinessEmailWarning: boolean = false;
    private resetSuccessWarning: boolean = false;
    private resetFailureWarning: boolean = false;
    private resetBusinessSuccessWarning: boolean = false;
    private resetBusinessFailureWarning: boolean = false;
    private loggedin: boolean = false;

    private resendEmailWarning: boolean = false;
    private resendSuccessWarning: boolean = false;
    private resendFailureWarning: boolean = false;

    constructor(
        private loginService: LoginService,
        private router: Router,
        private http: Http,
        private appService: AppService
    ) { }


    ngOnInit() { }


    onUserLogin(){
        if(!this.username || this.username.length == 0){
            this.incorrectUserWarning = false;
            this.userUsernameWarning = true;
            setTimeout(() => {
                this.userUsernameWarning = false;
            }, 5000);
        }
        else {
            this.userUsernameWarning = false;
        }
        if(!this.userPassword || this.userPassword.length == 0){
            this.incorrectUserWarning = false;

            this.userPasswordWarning = true;
            setTimeout(() => {
                this.userPasswordWarning = false;
            }, 5000);
        }
        else {
            this.userPasswordWarning = false;
        }

        if (!this.userUsernameWarning && !this.userPasswordWarning) {
            this.loginService.userLogin(this.username, this.userPassword).subscribe(data => {
                if (data.success) {

                    this.loggedin = true;
                    setTimeout(() => {
                        location.reload();
                    }, 1000);

                }
                else {
                    this.incorrectUserWarning = true;
                    setTimeout(() => {
                        this.incorrectUserWarning = false;
                    }, 5000);
                    this.username = null;
                    this.userPassword = null;
                }
            }, err => {
                bootbox.alert(err.msg);
            });
        }

    }


    onBusinessLogin(){
        if(!this.businessEmail || this.businessEmail.length == 0){
            this.incorrectBusinessWarning = false;
            this.businessEmailWarning = true;
            setTimeout(() => {
                this.businessEmailWarning = false;
            }, 5000);
        }
        else {
            this.businessEmailWarning = false;
        }
        if(!this.businessPassword || this.businessPassword.length == 0){
            this.incorrectBusinessWarning = false;
            this.businessPasswordWarning = true;
            setTimeout(() => {
                this.businessPasswordWarning = false;
            }, 5000);
        }
        else {
            this.businessPasswordWarning = false;
        }

        if (!this.businessEmailWarning && !this.businessPasswordWarning) {

            this.loginService.businessLogin(this.businessEmail, this.businessPassword).subscribe(data => {
                if (data.success) {
                    this.loggedin = true;
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
                else {
                    this.incorrectBusinessWarning = true;
                    setTimeout(() => {
                        this.incorrectBusinessWarning = false;
                    }, 5000);
                    this.businessEmail = null;
                    this.businessPassword = null;
                }
            }, err => {
                bootbox.alert(err.msg);
            });
        }

    }


    onUserForgetPass() {
        if (!this.userEmail || this.userEmail.length == 0) {
            this.resetUserEmailWarning = true;
            setTimeout(() => {
                this.resetUserEmailWarning = false;
            }, 5000);
        }
        else {
            this.resetUserEmailWarning = false;
        }

        if (!this.resetUserEmailWarning) {
            this.loginService.forgetPassword(this.userEmail).subscribe(data => {
            this.resetFailureWarning = false;
            this.resetSuccessWarning = true;
            setTimeout(() => {
                this.resetSuccessWarning = false;
            }, 5000);
            this.successReset = data.msg;
        }, err => {
            this.resetSuccessWarning = false;
            this.resetFailureWarning = true;
            setTimeout(() => {
                this.resetFailureWarning = false;
            }, 5000);
            if(err.status == 500) {
                this.failedReset = err.json().error[0].msg;
            }
            else {
                this.failedReset = err.json().msg;
            }
             });
        }

    }


    onBusinessForgetPass() {
        if (!this.businessEmail || this.businessEmail.length == 0) {
            this.resetBusinessEmailWarning = true;
            setTimeout(() => {
                this.resetBusinessEmailWarning = false;
            }, 5000);
        }
        else {
            this.resetBusinessEmailWarning = false;
        }

        if (!this.resetBusinessEmailWarning) {
            this.loginService.forgetPassword(this.businessEmail).subscribe(data => {
            this.resetFailureWarning = false;
            this.resetSuccessWarning = true;
            setTimeout(() => {
                this.resetSuccessWarning = false;
            }, 5000);
            this.successReset = data.msg;
        }, err => {
            this.resetSuccessWarning = false;
            this.resetFailureWarning = true;
            setTimeout(() => {
                this.resetFailureWarning = false;
            }, 5000);
            if(err.status == 500) {
                this.failedReset = err.json().error[0].msg;
            }
            else {
                this.failedReset = err.json().msg;
            }
        });
        }

    }


    onResendEmail() {

        if (!this.userEmail || this.userEmail.length == 0) {
            this.resendEmailWarning = true;
            setTimeout(() => {
                this.resendEmailWarning = false;
            }, 5000);
        }
        else {
            this.resendEmailWarning = false;
        }

        if (!this.resendEmailWarning) {
            this.loginService.resendEmail(this.userEmail).subscribe(data => {
            this.resendFailureWarning = false;
            this.resendSuccessWarning = true;
            setTimeout(() => {
                this.resendSuccessWarning = false;
            }, 5000);
            this.successResend = data.msg;
        }, err => {
            this.resendSuccessWarning = false;
            this.resendFailureWarning = true;
            setTimeout(() => {
                this.resendFailureWarning = false;
            }, 5000);
            if(err.status == 500) {
                this.failedResend = err.json().error[0].msg;
            }
            else {
                this.failedResend = err.json().msg;
            }
             });
        }

    }


    hideuserUsernameWarning() {
        this.userUsernameWarning = false;
    }

    hideuserPasswordWarning() {
        this.userPasswordWarning = false;
    }

    hidebusinessEmailWarning() {
        this.businessEmailWarning = false;
    }

    hidebusinessPasswordWarning() {
        this.businessPasswordWarning = false;
    }

    hideIncorrectUserWarning() {
        this.incorrectUserWarning = false;
    }

    hideIncorrectBusinessWarning() {
        this.incorrectBusinessWarning = false;
    }

    hideResetUserEmailWarning() {
        this.resetUserEmailWarning = false;
    }

    hideResetBusinessEmailWarning() {
        this.resetBusinessEmailWarning = false;
    }

    hideResetSuccessWarning() {
        this.resetSuccessWarning = false;
    }

    hideResendFailureWarning() {
        this.resendFailureWarning = false;
    }

    hideResendSuccessWarning() {
        this.resendSuccessWarning = false;
    }

    hideResendEmailWarning() {
        this.resendEmailWarning = false;
    }

    onUserLoginCancel() {
        this.username = null;
        this.userPassword = null;
        this.userEmail = null;
        this.userUsernameWarning = false;
        this.userPasswordWarning = false;
        this.incorrectUserWarning = false;
        this.resetUserEmailWarning = false;
        this.resetFailureWarning = false;
        this.resetSuccessWarning = false;
        this.loggedin = false;
    }


    onBusinessLoginCancel() {
        this.businessEmail = null;
        this.businessPassword = null;
        this.businessEmailWarning = false;
        this.businessPasswordWarning = false;
        this.resetBusinessEmailWarning = false;
        this.incorrectBusinessWarning = false;
        this.resetFailureWarning = false;
        this.resetSuccessWarning = false;
        this.loggedin = false;
    }

    onUserForgetPassCancel() {
        this.username = null;
        this.userPassword = null;
        this.userEmail = null;
        this.userUsernameWarning = false;
        this.userPasswordWarning = false;
        this.incorrectUserWarning = false;
        this.resetUserEmailWarning = false;
        this.resetSuccessWarning = false;
        this.resetFailureWarning = false;
    }

    onBusinessForgetPassCancel() {
        this.businessEmail = null;
        this.businessPassword = null;
        this.businessEmailWarning = false;
        this.businessPasswordWarning = false;
        this.incorrectBusinessWarning = false;
        this.resetBusinessEmailWarning = false;
        this.resetSuccessWarning = false;
        this.resetFailureWarning = false;
    }

    onResendCancel() {
        this.userEmail = null;
        this.username = null;
        this.userPassword = null;
        this.businessEmail = null;
        this.businessPassword = null;
        this.userUsernameWarning = false;
        this.userPasswordWarning = false;
        this.incorrectUserWarning = false;
        this.businessEmailWarning = false;
        this.businessPasswordWarning = false;
        this.incorrectBusinessWarning = false;
        this.resendEmailWarning = false;
        this.resendSuccessWarning = false;
        this.resendFailureWarning = false;
    }

    keyDownUserLogin(event) {
        if (event.keyCode == 13) {
          this.onUserLogin();
        }
    }
    keyDownForgetUser(event) {
        if (event.keyCode == 13) {
          this.onUserForgetPass();
        }
    }

    keyDownBusinessLogin(event) {
        if (event.keyCode == 13) {
          this.onBusinessLogin();
        }
    }

    keyDownForgetBusiness(event) {
        if (event.keyCode == 13) {
          this.onBusinessForgetPass();
        }
    }

    keyDownResend(event) {
        if (event.keyCode == 13) {
          this.onResendEmail();
        }
    }

}

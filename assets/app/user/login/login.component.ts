import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
import { LoginService } from './login.service';
import { AppService } from '../../app.service';
import {Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector : 'app-signin',
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

    constructor(
        private loginService: LoginService,
        private router: Router,
        private http: Http,
        private appService: AppService
        ){ }
    

    ngOnInit() {}


    onUserLogin(){
        if(!this.username || this.username.length == 0){
            this.userUsernameWarning = true;
           }
        else {
            this.userUsernameWarning = false;        
        }
        if(!this.userPassword || this.userPassword.length == 0){
            this.userPasswordWarning = true;
        }
        else{
            this.userPasswordWarning = false;
        }

        if(!this.userUsernameWarning && !this.userPasswordWarning){
            this.loginService.userLogin(this.username, this.userPassword).subscribe(data => {
            if(data.success){
           // console.log("login");
           this.loggedin = true;
            this.loginClicked.emit(true);
            this.appService.login();
            }
            else{
            this.incorrectUserWarning = true;
            this.username = null;
            this.userPassword = null; 
            }
        }, err => {
            console.log(err);
        });
        }

    }


    onBusinessLogin(){
        if(!this.businessEmail || this.businessEmail.length == 0){
            this.businessEmailWarning = true;
           }
        else {
            this.businessEmailWarning = false;        
        }
        if(!this.businessPassword || this.businessPassword.length == 0){
            this.businessPasswordWarning = true;
        }
        else{
            this.businessPasswordWarning = false;
        }

        if(!this.businessEmailWarning && !this.businessPasswordWarning){

            this.loginService.businessLogin(this.businessEmail, this.businessPassword).subscribe(data => {
            if(data.success){
            this.loggedin = true;
            this.loginClicked.emit(true);
            this.appService.login();
            }
            else{
               this.incorrectBusinessWarning = true;
               this.businessEmail = null;
               this.businessPassword = null;    
            }
        }, err => {
            //console.log(err);
        });
        }
        
    }


    onUserForgetPass() {
        if(!this.userEmail || this.userEmail.length == 0){
            this.resetUserEmailWarning = true;
           }
        else {
            this.resetUserEmailWarning = false;        
        }

        if(!this.resetUserEmailWarning) {
            this.loginService.forgetPassword(this.userEmail).subscribe(data => {
            this.resetFailureWarning = false; 
            this.resetSuccessWarning = true; 
            this.successReset = data.msg;        
            //console.log(data.msg);   
        }, err => {
            this.resetSuccessWarning = false;
            this.resetFailureWarning = true;
            if(err.status == 500) {
                this.failedReset = err.json().error[0].msg;
            }
            else {
                this.failedReset = err.json().msg;
            }
            //console.log(err.json());
             });
        }
        
    }


    onBusinessForgetPass() {
        if(!this.businessEmail || this.businessEmail.length == 0){
            this.resetBusinessEmailWarning = true;
           }
        else {
            this.resetBusinessEmailWarning = false;        
        }

        if(!this.resetBusinessEmailWarning) {
            this.loginService.forgetPassword(this.businessEmail).subscribe(data => {
            this.resetFailureWarning = false; 
            this.resetSuccessWarning = true; 
            this.successReset = data.msg;
            //console.log(data);
        }, err => {
            this.resetSuccessWarning = false;
            this.resetFailureWarning = true;
            if(err.status == 500) {
                this.failedReset = err.json().error[0].msg;
            }
            else {
                this.failedReset = err.json().msg;
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
    
    hideResetFailureWarning() {
        this.resetFailureWarning = false;
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

}

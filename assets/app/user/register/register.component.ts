import { Component, Input } from '@angular/core';
import { UserRegisterService } from './register.service';
import { User } from '../user.model';

@Component({
    selector: 'user-register',
    templateUrl: './register.component.html'

})

export class RegisterComponent {
    //getting the entered values by two way binding
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    success: boolean = false;
    failure: boolean = false;
    message: string;

    //warnings
    firstNameRequired = false;
    lastNameRequired = false;
    emailRequired = false;
    usernameRequired = false;
    passwordRequired = false;
    passwordLength = false;
    identicalPasswords = false;

    constructor(private registerService: UserRegisterService) { }

    onSubmit() {
        //Construct a new user of user.model.ts with the values entered on pressing submit
        const user = new User(
            this.firstName,
            this.lastName,
            this.username,
            this.password,
            this.confirmPassword,
            this.email
        )


        this.firstNameRequired = false;
        this.lastNameRequired = false;
        this.emailRequired = false;
        this.usernameRequired = false;
        this.passwordRequired = false;
        this.passwordLength = false;
        this.identicalPasswords = false;


        if (!this.firstName || this.firstName.length == 0) {
            this.firstNameRequired = true;
            setTimeout(() => {
                this.firstNameRequired = false;
            }, 5000);
        }
        else {
            this.firstNameRequired = false;
        }
        if (!this.lastName || this.lastName.length == 0) {
            this.lastNameRequired = true;
            setTimeout(() => {
                this.lastNameRequired = false;
            }, 5000);
        }
        else {
            this.lastNameRequired = false;
        }
        if (!this.email || this.email.length == 0) {
            this.emailRequired = true;
            setTimeout(() => {
                this.emailRequired = false;
            }, 5000);
        }
        else {
            this.emailRequired = false;
        }
        if (!this.username || this.username.length == 0) {
            this.usernameRequired = true;
            setTimeout(() => {
                this.usernameRequired = false;
            }, 5000);
        }
        else {
            this.usernameRequired = false;
        }
        if (!this.password || this.password.length == 0) {
            this.passwordRequired = true;
            setTimeout(() => {
                this.passwordRequired = false;
            }, 5000);
        }
        else {
            this.passwordRequired = false;
        }
        if (!this.password || this.password.length < 8) {
            this.passwordLength = true;
            setTimeout(() => {
                this.passwordLength = false;
            }, 5000);
        }
        else {
            this.passwordLength = false;
        }
        if (this.password != this.confirmPassword) {
            this.identicalPasswords = true;
            setTimeout(() => {
                this.identicalPasswords = false;
            }, 5000);
        }
        else {
            this.identicalPasswords = false;
        }


        /*
        Calling the signUp function from the service to handle the register operation
        Gets back data and error messages then handling them by bootstrap alerts
        Setting the success and failure booleans to check on them in the html file
        */


        if (!this.firstNameRequired && !this.lastNameRequired && !this.emailRequired && !this.usernameRequired && !this.passwordRequired && !this.passwordLength && !this.identicalPasswords) {
            this.registerService.signUp(user)
                .subscribe(
                (data) => {
                    this.success = true;
                    setTimeout(() => {
                        // location.reload();
                        $("#userRegisterClose").click();
                    }, 5000);

                },
                (error) => {
                    this.success = false;
                    this.failure = true;
                    this.message = error.error.msg;
                }
                );
        }

    };

    hideFirstNameWarning() {
        this.firstNameRequired = false;
    }
    hideLastNameWarning() {
        this.lastNameRequired = false;
    }
    hideEmailWarning() {
        this.emailRequired = false;
    }
    hideUsernameWarning() {
        this.usernameRequired = false;
    }
    hidePasswordWarning() {
        this.passwordRequired = false;
    }
    hideLengthWarning() {
        this.passwordLength = false;
    }
    hideIdenticalPasswords() {
        this.identicalPasswords = false;
    }

    onClose() {
        this.firstName = "";
        this.lastName = "";
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
        this.email = "";


        this.firstNameRequired = false;
        this.lastNameRequired = false;
        this.emailRequired = false;
        this.usernameRequired = false;
        this.passwordRequired = false;
        this.passwordLength = false;
        this.identicalPasswords = false;
    }
}

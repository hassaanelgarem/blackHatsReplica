import { Component, Input } from '@angular/core';
import { BusinessRegisterService } from './businessRegister.service';
import { Business } from '../business.model';
@Component({
    selector: 'business-register',
    templateUrl: './businessRegister.component.html'

})

export class BusinessRegisterComponent {
    name: string;
    password: string;
    confirmPassword: string;
    email: string;
    description: string;
    success: boolean = false;
    failure: boolean = false;
    message: string;

    //warnings
    nameRequired = false;
    passwordRequired = false;
    passwordLength = false;
    descriptionRequired = false;
    identicalPasswords = false;
    emailRequired = false;

    constructor(private businessRegisterService: BusinessRegisterService) { }

    onSubmit() {
        //Construct a new business of business.model.ts with the values entered on pressing submit
        const business = new Business(
            this.name,
            this.password,
            this.confirmPassword,
            this.email,
            this.description
        )


        this.nameRequired = false;
        this.passwordRequired = false;
        this.passwordLength = false;
        this.descriptionRequired = false;
        this.identicalPasswords = false;
        this.emailRequired = false;

        /*
        Calling the signUp function from the service to handle the Business Application operation
        Gets back data and error messages then handling them by bootstrap alerts
        Setting the success and failure booleans to check on them in the html file
        */
        if (!this.name || this.name.length == 0) {
            this.nameRequired = true;
            setTimeout(() => {
                this.nameRequired = false;
            }, 5000);
        }
        else {
            this.nameRequired = false;
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
        if (!this.description || this.description.length == 0) {
            this.descriptionRequired = true;
            setTimeout(() => {
                this.descriptionRequired = false;
            }, 5000);
        }
        else {
            this.descriptionRequired = false;
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
        if (!this.email || this.email.length == 0) {
            this.emailRequired = true;
            setTimeout(() => {
                this.emailRequired = false;
            }, 5000);
        }
        else {
            this.emailRequired = false;
        }
        if (!this.emailRequired && !this.identicalPasswords && !this.descriptionRequired && !this.passwordLength && !this.passwordRequired && !this.nameRequired) {
            this.businessRegisterService.signUp(business)
                .subscribe(
                (data) => {
                    this.success = true;
                    setTimeout(() => {
                        this.success = false;
                        $("#businessRegisterClose").click();
                    }, 5000);
                },
                (error) => {
                    this.success = false;
                    this.failure = true;
                    this.message = error.error.msg;
                });
        }
    };

    hideNameWarning() {
        this.nameRequired = false;
    }

    hidePasswordWarning() {
        this.passwordRequired = false;
    }

    hideLengthWarning() {
        this.passwordLength = false;
    }

    hideDescriptionWarning() {
        this.descriptionRequired = false;
    }
    hideIdenticalPasswords() {
        this.identicalPasswords = false;
    }
    hideEmailRequired() {
        this.emailRequired = false;
    }

    onClose() {
        this.name = "";
        this.password = "";
        this.confirmPassword = "";
        this.email = "";
        this.description = "";

        this.nameRequired = false;
        this.passwordRequired = false;
        this.passwordLength = false;
        this.descriptionRequired = false;
        this.identicalPasswords = false;
        this.emailRequired = false;

    }

}

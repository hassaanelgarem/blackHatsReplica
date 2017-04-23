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

        /*
        Calling the signUp function from the service to handle the Business Application operation
        Gets back data and error messages then handling them by bootstrap alerts
        Setting the success and failure booleans to check on them in the html file
        */
        this.businessRegisterService.signUp(business)
            .subscribe(
            data => {
                this.failure = false;
                this.success = true;
                this.message = data.msg;
            },
            error => {
                this.success = false;
                this.failure = true;
                this.message = error.error.msg;
            });
    };

}

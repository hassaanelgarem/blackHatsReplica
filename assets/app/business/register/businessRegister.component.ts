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
       Calling the signUp function from the service to handle the register operation
       Gets back data and error and then handling them by pop up alerts
       */
        this.businessRegisterService.signUp(business)
            .subscribe(
            data => alert(data.msg),
            error => alert(error.error.msg)
            );
    };

}

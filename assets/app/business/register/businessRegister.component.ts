import { Component, Input} from '@angular/core';
import {BusinessRegisterService} from './businessRegister.service';
import { Business } from '../business.model';
@Component({
    selector : 'business-register',
    templateUrl: './businessRegister.component.html'

})

export class BusinessRegisterComponent{
    name: string;
    password: string;
    confirmPassword: string;
    email: string;
    description: string;

    constructor(private businessRegisterService: BusinessRegisterService){}

    onSubmit() {
        const business = new Business(
            this.name,
            this.password,
            this.confirmPassword,
            this.email,
            this.description
        )

        this.businessRegisterService.signUp(business)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
    };
    
}
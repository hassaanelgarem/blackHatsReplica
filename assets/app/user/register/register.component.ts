import { Component, Input} from '@angular/core';
import {RegisterService } from './register.service';
import { User } from '../user.model';
@Component({
    selector : 'user-register',
    templateUrl: './register.component.html'

})

export class RegisterComponent{
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    birthDate: Date;

    constructor(private registerService: RegisterService){}

    onSubmit() {
        const user = new User(
            this.firstName,
            this.lastName,
            this.username,
            this.password,
            this.confirmPassword,
            this.email,
            this.birthDate
        )

        this.registerService.signUp(user)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
    };

}

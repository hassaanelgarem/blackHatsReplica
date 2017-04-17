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
    birthDate: Date;
    constructor(private registerService: UserRegisterService) { }

    onSubmit() {
        //Construct a new user of user.model.ts with the values entered on pressing submit
        const user = new User(
            this.firstName,
            this.lastName,
            this.username,
            this.password,
            this.confirmPassword,
            this.email,
            this.birthDate
        )

        /*
        Calling the signUp function from the service to handle the register operation
        Gets back data and error and then handling them by pop up alerts
        */
        this.registerService.signUp(user)
            .subscribe(
            data => alert(data.msg),
            error => alert(error.error.msg)
            );
    };
}

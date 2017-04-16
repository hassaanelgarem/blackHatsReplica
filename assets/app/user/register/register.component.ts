import { Component } from '@angular/core';
import {registerService } from './register.service';
@Component({
    selector : 'user-register',
    templateUrl: './register.component.html'

})

export class RegisterComponent{
    constructor(private registerService: registerService){}
}
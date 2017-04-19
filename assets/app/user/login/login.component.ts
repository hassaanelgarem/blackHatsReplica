import { Component, Output ,EventEmitter} from '@angular/core';

@Component({
    selector : 'app-signin',
    templateUrl: './login.component.html'

})

export class LoginComponent{
    @Output() loginClicked =new EventEmitter<boolean>();

    onLogin(){
            this.loginClicked.emit(true);
    }
}
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UserService } from './user.service';
import { User } from './user.model';


@Component({
    selector: 'app-admin-user-unAssignAdmin',
    templateUrl: './unAssignAdmin.component.html'
})


export class UnAssignAdminComponent implements OnInit {
    private users: User[] = [];
    constructor(private userService: UserService) { }
    ngOnInit() {
        this.userService.getAdmins().subscribe(users => {
            this.users = users;
        });
    }

    unAssignAdmin(userId: string) {
        this.userService.unAssignAdmin(userId).subscribe(msg => {
            alert(msg);
            location.reload();
        });
    }
};

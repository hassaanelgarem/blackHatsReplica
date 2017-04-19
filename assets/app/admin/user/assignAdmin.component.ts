import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UserService } from './user.service';
import { User } from './user.model';


@Component({
    selector: 'app-admin-user-assignAdmin',
    templateUrl: './assignAdmin.component.html'
})


export class AssignAdminComponent implements OnInit {
    private users: User[] = [];
    constructor(private userService: UserService) { }
    ngOnInit() {
        this.userService.getNonAdmins().subscribe(users => {
            this.users = users;
        });
    }

    assignAdmin(userId: string) {
        this.userService.assignAdmin(userId).subscribe(msg => {
            alert(msg);
            location.reload();
        });
    }
};

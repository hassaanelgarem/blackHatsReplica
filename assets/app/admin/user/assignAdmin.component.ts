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
    private loading: boolean = false;
    constructor(private userService: UserService) { }
    ngOnInit() {
        this.userService.getNonAdmins().subscribe(users => {
            this.users = users;
        });
    }

    isLoading() {
        return this.loading;
    }

    assignAdmin(userId: string) {
        bootbox.confirm({
            title: "Assign Admin?",
            message: "Are you sure you want to assign this user as an admin?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Assign'
                }
            },
            callback: (result) => {
                if (result) {
                    this.loading = true;
                    this.userService.assignAdmin(userId).subscribe(msg => {
                        bootbox.alert(msg, () => {
                            location.reload();
                        });
                    });
                }
            }
        });
    }
};

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
    private loading: boolean = false;
    constructor(private userService: UserService) { }
    ngOnInit() {
        this.userService.getAdmins().subscribe(users => {
            this.users = users;
        },
            err => {
                bootbox.alert(err.msg);
            });
    }

    isLoading() {
        return this.loading;
    }

    unAssignAdmin(userId: string) {
        bootbox.confirm({
            title: "Unassign Admin?",
            message: "Are you sure you want to unassign this user from admin position?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Unassign'
                }
            },
            callback: (result) => {
                if (result) {
                    this.loading = true;
                    this.userService.unAssignAdmin(userId).subscribe(msg => {
                        bootbox.alert(msg, () => {
                            location.reload();
                        });
                    },
                        err => {
                            bootbox.alert(err.msg, () => {
                                location.reload();
                            });
                        });
                }
            }
        });
    }
};

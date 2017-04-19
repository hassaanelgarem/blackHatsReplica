import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user.model';
import $ = require('jquery')


@Component({
  selector: 'app-admin-user-review',
  templateUrl: './review.component.html'
})


export class ReviewComponent implements OnInit {
  private users: User[] = [];
  constructor(private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.userService.getUnverifiedUsers().subscribe(tempUsers => {
        this.users = users.concat(tempUsers);
      })
    });
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(msg => {
      alert(msg);
      location.reload();

    });
  }

  viewUser(userId: string) {
    //To be adjusted for the user profile route.
    alert('To be redirected to profile');
    // this.router.navigate(['admin', userId]);
  }
};

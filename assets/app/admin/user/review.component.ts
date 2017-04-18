import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserService } from './user.service';
import { User } from './user.model';
import $ from 'jquery';


@Component({
  selector: 'app-admin-user-review',
  templateUrl: './review.component.html'
})


export class ReviewComponent implements OnInit {
  private users: User[] = [];
  constructor(private userService: UserService) { }
  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  deleteUser(userId: string){
    this.userService.deleteUser(userId);
    $().alert();
  }
};

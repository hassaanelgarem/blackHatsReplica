import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './navbar.component.html'
})


export class NavbarComponent {
  constructor(private adminService: AdminService, private router: Router) { }
  logout() {
    this.adminService.logout().subscribe(response => {
      this.router.navigateByUrl('/');
    });
  }
};

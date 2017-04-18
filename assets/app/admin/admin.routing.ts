import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

import { USER_ROUTES } from './user/user.routing';

export const ADMIN_ROUTES: Routes = [
    { path: '', component: AdminComponent },
    { path: 'user', children: USER_ROUTES }
];

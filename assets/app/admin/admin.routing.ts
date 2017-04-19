import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

import { USER_ROUTES } from './user/user.routing';
import { BUSINESS_ROUTES } from './business/business.routing';

export const ADMIN_ROUTES: Routes = [
    { path: '', component: AdminComponent },
    { path: 'user', children: USER_ROUTES },
    { path: 'business', children: BUSINESS_ROUTES }
];

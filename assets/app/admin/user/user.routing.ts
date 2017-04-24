import { UnAssignAdminComponent } from './unAssignAdmin.component';
import { AssignAdminComponent } from './assignAdmin.component';
import { ReviewComponent } from './review.component';

import { Routes } from '@angular/router';


export const USER_ROUTES: Routes = [
    { path: '', redirectTo: 'review', pathMatch: 'full' },
    { path: 'review', component: ReviewComponent },
    { path: 'assignAdmin', component: AssignAdminComponent },
    { path: 'unAssignAdmin', component: UnAssignAdminComponent }
];

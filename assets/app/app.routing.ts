import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";

import { ADMIN_ROUTES } from './admin/admin.routing';

const APP_ROUTES: Routes = [
    { path: '', component: AppComponent },
    { path: 'admin', children: ADMIN_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

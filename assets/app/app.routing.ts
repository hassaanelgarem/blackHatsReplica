import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";

import { ADMIN_ROUTES } from './admin/admin.routing';
import { NON_ADMIN_ROUTES } from './nonAdmin.routing';

const APP_ROUTES: Routes = [
    { path: '', children: NON_ADMIN_ROUTES },
    { path: 'admin', children: ADMIN_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

import { LoaderComponent } from './loader.component';
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AdminComponent } from "./admin/admin.component";

import { ADMIN_ROUTES } from './admin/admin.routing';
import { NON_ADMIN_ROUTES } from './nonAdmin.routing';

const APP_ROUTES: Routes = [
    
    { path: 'admin', component: AdminComponent,  children: ADMIN_ROUTES },
    { path: '', component: LoaderComponent, children: NON_ADMIN_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

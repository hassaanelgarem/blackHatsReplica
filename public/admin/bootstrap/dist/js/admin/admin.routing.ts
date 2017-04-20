import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";

const APP_ROUTES: Routes = [
    {path: 'admin', component: AdminComponent}
];

export const adminRouting = RouterModule.forChild(APP_ROUTES);

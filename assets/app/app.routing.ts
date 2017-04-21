import { Routes, RouterModule } from "@angular/router";

import { UserComponent } from "./user/user.component";
import { FourofourComponent } from "./errors/404.component";
import { NotAuthorizedErrorComponent } from "./errors/notAuthorized.component";
import { SomethingWrongComponent } from "./errors/500.component";

const APP_ROUTES: Routes = [
    { path: 'user', component: UserComponent},
    { path: '404-error', component: FourofourComponent},
    { path: 'notAuthorized-error', component: NotAuthorizedErrorComponent},
    { path: '500-error', component: SomethingWrongComponent}
];


export const routing = RouterModule.forRoot(APP_ROUTES);

import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { UserComponent } from "./user/user.component";
import { FourofourComponent } from "./errors/404.component";
import { NotAuthorizedErrorComponent } from "./errors/notAuthorized.component";

const APP_ROUTES: Routes = [
    { path: 'dummy', component: DummyComponent },
    { path: 'user', component: UserComponent},
    { path: '404-error', component: FourofourComponent},
    { path: 'notAuthorized-error', component: NotAuthorizedErrorComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

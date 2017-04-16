import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { UserComponent } from "./user/user.component";
import { User_ROUTES } from "./user/user.routes";  //child routes

const APP_ROUTES: Routes = [
    { path: 'dummy', component: DummyComponent },
    { path: 'user', component: UserComponent ,children :User_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

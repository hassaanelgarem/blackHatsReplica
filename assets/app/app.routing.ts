import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { UserComponent } from "./user/user.component";
import { User_ROUTES } from "./user/user.routes";

const APP_ROUTES: Routes = [
    { path: 'business', component: BusinessComponent },
    { path: 'dummy', component: DummyComponent },
    { path: 'user', component: UserComponent ,children :User_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

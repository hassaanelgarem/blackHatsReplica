import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { UserComponent } from "./user/user.component";

const APP_ROUTES: Routes = [
    { path: 'business', component: BusinessComponent },
    { path: 'dummy', component: DummyComponent },
    { path: 'user', component: UserComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

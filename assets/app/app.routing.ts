import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { BusinessEditComponent } from "./businessEdit/businessEdit.component";
import { UserComponent } from "./user/user.component";

const APP_ROUTES: Routes = [
    { path: 'business', component: BusinessEditComponent },
    { path: 'dummy', component: DummyComponent },
    { path: 'user', component: UserComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

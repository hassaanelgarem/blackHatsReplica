import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { RegisterComponent } from "./user/register/register.component";


const APP_ROUTES: Routes = [
    { path: 'homepage', component: HomepageComponent },
    { path: 'business', component: BusinessComponent },
    { path: 'dummy', component: DummyComponent },
    { path: 'userRegister', component: RegisterComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

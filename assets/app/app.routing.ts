import { Routes, RouterModule } from "@angular/router";

import { BusinessComponent } from "./business/business.component";
import { HomepageComponent } from "./homepage/homepage.component";


const APP_ROUTES: Routes = [
    { path: 'homepage', component: HomepageComponent },
    { path: 'business', component: BusinessComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

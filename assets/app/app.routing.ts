import { Routes, RouterModule } from "@angular/router";

import { HomepageComponent } from "./homepage/homepage.component";


const APP_ROUTES: Routes = [
    { path: 'homepage', component: HomepageComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

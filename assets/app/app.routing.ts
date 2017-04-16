import { Routes, RouterModule } from "@angular/router";
import { NameOrTagComponent } from "./homepage/search/nameOrTagResult/result.component";

import { HomepageComponent } from "./homepage/homepage.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'search', component: NameOrTagComponent }

];

export const routing = RouterModule.forRoot(APP_ROUTES);

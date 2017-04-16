import { Routes, RouterModule } from "@angular/router";
import { NameOrTagComponent } from "./homepage/search/nameOrTagResult/result.component";

import { HomepageComponent } from "./homepage/homepage.component";

const APP_ROUTES: Routes = [
    { path: 'homepage', component: HomepageComponent},
    { path: 'viewBusinessesSearch', component: NameOrTagComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES);

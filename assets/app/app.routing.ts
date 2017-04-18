import { Routes, RouterModule } from "@angular/router";

import { HomepageComponent } from "./homepage/homepage.component";
import { NameOrTagComponent } from "./homepage/search/nameOrTagResult/result.component";




const APP_ROUTES: Routes = [
    { path: '**',redirectTo:'/homepage'},
    { path: '',redirectTo:'/homepage', pathMatch: 'full'},
    { path: 'homepage', component: HomepageComponent},
    { path: 'viewBusinessesSearch', component: NameOrTagComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES);

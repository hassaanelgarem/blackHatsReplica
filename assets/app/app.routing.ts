import { Routes, RouterModule } from "@angular/router";

import { HomepageComponent } from "./homepage/homepage.component";
import { SearchResultComponent } from "./homepage/search/SearchResult/result.component";




const APP_ROUTES: Routes = [
    { path: '**',redirectTo:'/homepage'},
    { path: '',redirectTo:'/homepage', pathMatch: 'full'},
    { path: 'homepage', component: HomepageComponent},
    { path: 'search', component: SearchResultComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES);

import { Routes, RouterModule } from "@angular/router";

import { HomepageComponent } from "./homepage/homepage.component";
import { SearchResultComponent } from "./homepage/search/SearchResult/result.component";
import { TermsComponent } from "./terms/terms.component";
import { PolicyComponent } from "./policy/policy.component";
import { ResetPasswordComponent } from "./user/resetPassword/resetPassword.component";




const APP_ROUTES: Routes = [
    
    { path: '',redirectTo:'/homepage', pathMatch: 'full'},
    { path: 'homepage', component: HomepageComponent},
    { path: 'search', component: SearchResultComponent},
    { path: 'terms', component: TermsComponent },
    { path: 'policy', component: PolicyComponent },
    { path: 'resetPassword/:token', component: ResetPasswordComponent},
    { path: '**',redirectTo:'/homepage'}

];

export const routing = RouterModule.forRoot(APP_ROUTES);

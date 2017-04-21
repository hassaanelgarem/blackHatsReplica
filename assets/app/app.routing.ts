import { Routes, RouterModule } from "@angular/router";


import { HomepageComponent } from "./homepage/homepage.component";
import { SearchResultComponent } from "./homepage/search/SearchResult/result.component";
import { TermsComponent } from "./terms/terms.component";
import { PolicyComponent } from "./policy/policy.component";
import { ResetPasswordComponent } from "./user/resetPassword/resetPassword.component";
import { VerifyComponent } from "./user/verify/verify.component";
import { BusinessEditComponent } from "./businessEdit/businessEdit.component";
import { EditActivityComponent} from "./businessEdit/activities/editActivity.component"
import { BusinessPageComponent } from "./businessPage/businessPage.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { UserComponent } from "./user/user.component";
import { FourofourComponent } from "./errors/404.component";
import { NotAuthorizedErrorComponent } from "./errors/notAuthorized.component";
import { SomethingWrongComponent } from "./errors/500.component";


const APP_ROUTES: Routes = [
    { path: '',redirectTo:'/homepage', pathMatch: 'full'},
    { path: 'homepage', component: HomepageComponent},
    { path: 'search', component: SearchResultComponent},
    { path: 'terms', component: TermsComponent },
    { path: 'policy', component: PolicyComponent },
    { path: 'resetPassword/:token', component: ResetPasswordComponent},
    { path: 'verify/:token', component: VerifyComponent},
    { path: 'businessEdit', component: BusinessEditComponent },
    { path: 'businessEdit/activity/:activityId', component: EditActivityComponent },
    { path: 'business/:businessId', component: BusinessPageComponent },
    { path: 'business/:businessId/reviews', component: ReviewsComponent },
    { path: 'user', component: UserComponent},
    { path: '404-error', component: FourofourComponent},
    { path: 'notAuthorized-error', component: NotAuthorizedErrorComponent},
    { path: '500-error', component: SomethingWrongComponent},
    { path: '**',redirectTo:'/homepage'}
];


export const routing = RouterModule.forRoot(APP_ROUTES);

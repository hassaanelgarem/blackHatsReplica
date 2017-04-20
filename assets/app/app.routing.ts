import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { BusinessPageComponent } from "./businessPage/businessPage.component";
import { ReviewsComponent } from "./reviews/reviews.component";

const APP_ROUTES: Routes = [
    { path: 'business', component: BusinessComponent },
    { path: 'dummy', component: DummyComponent },
    { path: 'business/:businessId', component: BusinessPageComponent },
    { path: 'business/:businessId/reviews', component: ReviewsComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

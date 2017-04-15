import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { BusinessComponent } from "./business/business.component";
import { BusinessPageComponent } from "./businessPage/businessPage.component";

const APP_ROUTES: Routes = [
    { path: 'business', component: BusinessComponent },
    { path: 'dummy', component: DummyComponent },
    { path: 'businessPage', component: BusinessPageComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

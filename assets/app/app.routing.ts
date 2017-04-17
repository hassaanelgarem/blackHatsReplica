import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { BusinessEditComponent } from "./businessEdit/businessEdit.component";

const APP_ROUTES: Routes = [
    { path: 'businessEdit', component: BusinessEditComponent },
    { path: 'dummy', component: DummyComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

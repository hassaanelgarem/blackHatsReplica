import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";

const APP_ROUTES: Routes = [
    { path: 'dummy', component: DummyComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

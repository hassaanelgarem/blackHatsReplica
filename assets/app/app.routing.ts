import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { EditProfileComponent } from "./editProfile/editProfile.component";

const APP_ROUTES: Routes = [
    { path: 'editProfile', component: EditProfileComponent },
    { path: 'dummy', component: DummyComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

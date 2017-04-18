import { Routes, RouterModule } from "@angular/router";

import { DummyComponent } from "./dummy/dummy.component";
import { EditProfileComponent } from "./editProfile/editProfile.component";
import { AddPhotoComponent } from "./addPhoto/addPhoto.component";
import { BookAdvComponent } from "./bookAdv/bookAdv.component";


const APP_ROUTES: Routes = [
    { path: 'editProfile', component: EditProfileComponent },
    { path: 'addPhoto', component: AddPhotoComponent },
    { path: 'bookAdv', component: BookAdvComponent },
    { path: 'dummy', component: DummyComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

import { Routes, RouterModule } from "@angular/router";

import { EditProfileComponent } from "./businessEdit/editProfile/editProfile.component";
import { AddPhotoComponent } from "./businessEdit/addPhoto/addPhoto.component";
import { BookAdvComponent } from "./businessEdit/bookAdv/bookAdv.component";
import { ActivityBookingsComponent } from "./businessEdit/activityBookings/activityBookings.component";


const APP_ROUTES: Routes = [
    { path: 'editProfile', component: EditProfileComponent },
    { path: 'addPhoto', component: AddPhotoComponent },
    { path: 'bookAdv', component: BookAdvComponent },
    { path: 'activityBookings' , component: ActivityBookingsComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

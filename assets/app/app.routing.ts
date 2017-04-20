import { Routes, RouterModule } from "@angular/router";

import { BusinessEditComponent } from "./businessEdit/businessEdit.component";
import { EditActivityComponent} from "./businessEdit/activities/editActivity.component"


const APP_ROUTES: Routes = [
    { path: 'businessEdit', component: BusinessEditComponent },
    { path: 'businessEdit/activity/:activityId', component: EditActivityComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);

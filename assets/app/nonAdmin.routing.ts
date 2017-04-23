import { Routes } from "@angular/router";

import { LoaderComponent } from './loader.component';

export const NON_ADMIN_ROUTES: Routes = [
    { path: '', component: LoaderComponent}
];

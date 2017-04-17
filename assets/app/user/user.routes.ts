import { Routes } from "@angular/router";

import { UserFavoritesComponent } from "./favorites/favorites.component";
import { ReviewComponent } from "./reviews/review.component";



export const User_ROUTES: Routes = [
    { path: 'favorites', component: UserFavoritesComponent },
    { path: 'reviews', component: ReviewComponent },
];
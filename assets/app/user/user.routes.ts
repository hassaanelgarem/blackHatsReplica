import { Routes } from "@angular/router";

import { FavoritesComponent } from "./favorites/favorites.component";
import { ReviewComponent } from "./reviews/review.component";



export const User_ROUTES: Routes = [
    { path: 'favorites', component: FavoritesComponent },
    { path: 'reviews', component: ReviewComponent },
];
import { Routes } from "@angular/router";

import { FavouritesComponent } from "./favourites/favourites.component";
import { ReviewComponent } from "./reviews/review.component";



export const User_ROUTES: Routes = [
    { path: 'favourites', component: FavouritesComponent },
    { path: 'reviews', component: ReviewComponent },
];
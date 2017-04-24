import { VerifyComponent } from './verify.component';
import { ReviewComponent } from './review.component';
import { Routes } from '@angular/router';


export const BUSINESS_ROUTES: Routes = [
    { path: '', redirectTo: 'review', pathMatch: 'full' },
    { path: 'review', component: ReviewComponent },
    { path: 'verify', component: VerifyComponent }
];
